import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { sendPushNotification } from "@/lib/push-notifications";
import { sendNotificationEmail } from "@/lib/email";

// ============================================================
// GET — Retrieve the authenticated student's contact details
// ============================================================

export async function GET() {
  try {
    // ----------------------------------------------------------
    // 1. Authenticate the current user
    // ----------------------------------------------------------

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    // Only students can request property viewings.
    if (user.role !== "STUDENT") {
      return NextResponse.json(
        {
          error: "Only students can request property viewings.",
        },
        { status: 403 }
      );
    }

    // ----------------------------------------------------------
    // 2. Return the student's contact information
    // ----------------------------------------------------------

    const student = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        name: true,
        email: true,
        studentProfile: {
          select: {
            phone: true,
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student profile not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        student: {
          name: student.name ?? "",
          email: student.email,
          phone: student.studentProfile?.phone ?? "",
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Failed to retrieve student contact information:",
      error
    );

    return NextResponse.json(
      { error: "Unable to load your contact information." },
      { status: 500 }
    );
  }
}

// ============================================================
// POST — Create a viewing request and notify the landlord
// ============================================================

export async function POST(request: Request) {
  try {
    // ----------------------------------------------------------
    // 1. Authenticate the student
    // ----------------------------------------------------------

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    if (user.role !== "STUDENT") {
      return NextResponse.json(
        {
          error: "Only students can request property viewings.",
        },
        { status: 403 }
      );
    }

    // ----------------------------------------------------------
    // 2. Parse and validate the request body
    // ----------------------------------------------------------

    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const { listingId, date, time, note, name, phone } = body;

    if (
      typeof listingId !== "string" ||
      !listingId.trim() ||
      typeof date !== "string" ||
      typeof time !== "string" ||
      typeof name !== "string" ||
      typeof phone !== "string"
    ) {
      return NextResponse.json(
        {
          error:
            "Please provide the property, preferred date, preferred time, name, and phone number.",
        },
        { status: 400 }
      );
    }

    const cleanListingId = listingId.trim();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    const cleanNote =
      typeof note === "string" ? note.trim() : "";

    if (!cleanName || cleanName.length > 100) {
      return NextResponse.json(
        {
          error: "Your name must be between 1 and 100 characters.",
        },
        { status: 400 }
      );
    }

    if (!cleanPhone || cleanPhone.length > 40) {
      return NextResponse.json(
        { error: "Please provide a valid phone number." },
        { status: 400 }
      );
    }

    if (cleanNote.length > 1000) {
      return NextResponse.json(
        {
          error: "Your note cannot exceed 1000 characters.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // 3. Validate the requested date and time
    // ----------------------------------------------------------

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)
    ) {
      return NextResponse.json(
        { error: "Please provide a valid date and time." },
        { status: 400 }
      );
    }

    const [year, month, day] = date.split("-").map(Number);

    const calendarDate = new Date(
      Date.UTC(year, month - 1, day)
    );

    if (
      calendarDate.getUTCFullYear() !== year ||
      calendarDate.getUTCMonth() !== month - 1 ||
      calendarDate.getUTCDate() !== day
    ) {
      return NextResponse.json(
        { error: "Please provide a valid calendar date." },
        { status: 400 }
      );
    }

    // Convert the selected Zimbabwe local time (Africa/Harare, UTC+2)
    // into the correct UTC timestamp for database storage.
    const [hours, minutes] = time.split(":").map(Number);

    const requestedAt = new Date(
      Date.UTC(year, month - 1, day, hours - 2, minutes)
    );

    if (
      Number.isNaN(requestedAt.getTime()) ||
      requestedAt.getTime() <= Date.now()
    ) {
      return NextResponse.json(
        {
          error: "Please select a future viewing date and time.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // 4. Verify the listing is available for viewing requests
    // ----------------------------------------------------------

    const listing = await prisma.listing.findFirst({
      where: {
        id: cleanListingId,
        status: "PUBLISHED",
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        landlordId: true,
        landlord: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!listing) {
      return NextResponse.json(
        {
          error:
            "This property is unavailable or cannot accept viewing requests.",
        },
        { status: 404 }
      );
    }

    if (listing.landlordId === user.id) {
      return NextResponse.json(
        {
          error: "You cannot request a viewing for your own listing.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // 5. Create the request and in-app notification
    // ----------------------------------------------------------

    const title = "New Viewing Request";

    const message =
      `${cleanName} has requested a viewing for "${listing.title}".`;

    const result = await prisma.$transaction(async (tx) => {
      const viewingRequest = await tx.viewingRequest.create({
        data: {
          studentId: user.id,
          landlordId: listing.landlordId,
          listingId: listing.id,
          requestedAt,
          note: cleanNote || null,
          status: "PENDING",

          // Save contact details with the request.
          studentName: cleanName,
          studentPhone: cleanPhone,
          studentEmail: user.email,
        },
        select: {
          id: true,
          listingId: true,
          requestedAt: true,
          status: true,
          createdAt: true,
        },
      });

      const notification = await tx.notification.create({
        data: {
          userId: listing.landlordId,
          type: "VIEWING_REQUEST",
          title,
          message,
          link: "/dashboard/viewing-requests",
        },
      });

      return {
        viewingRequest,
        notification,
      };
    });

    // ----------------------------------------------------------
    // 6. Attempt browser push notification
    // ----------------------------------------------------------

    try {
      await sendPushNotification({
        userId: listing.landlordId,
        title,
        message,
        link: "/dashboard/viewing-requests",
      });
    } catch (error) {
      // Push failure must not undo the saved viewing request.
      console.error(
        "Failed to send viewing request push notification:",
        error
      );
    }

    // ----------------------------------------------------------
    // 7. Attempt email notification to the landlord
    // ----------------------------------------------------------

    if (listing.landlord.email) {
      try {
        await sendNotificationEmail({
          to: listing.landlord.email,

          subject: `New Viewing Request — ${listing.title}`,

          title,

          message,

          actionUrl: "/dashboard/viewing-requests",

          actionText: "View Request",
        });
      } catch (error) {
        // Email failure must not undo the saved viewing request.
        console.error(
          "Failed to send viewing request email:",
          error
        );
      }
    } else {
      console.warn(
        "Viewing request created, but the landlord has no email address.",
        {
          landlordId: listing.landlordId,
          viewingRequestId: result.viewingRequest.id,
        }
      );
    }

    // ----------------------------------------------------------
    // 8. Return the successful result
    // ----------------------------------------------------------

    return NextResponse.json(
      {
        message: "Viewing request submitted successfully.",
        viewingRequest: result.viewingRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Failed to create viewing request:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to submit your viewing request.",
      },
      { status: 500 }
    );
  }
}