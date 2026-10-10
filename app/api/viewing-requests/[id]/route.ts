import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { sendPushNotification } from "@/lib/push-notifications";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateRequestBody = {
  status?: unknown;
  landlordResponse?: unknown;
};

// ============================================================
// PATCH — Accept or decline a viewing request
// ============================================================

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    // ----------------------------------------------------------
    // 1. Authenticate the landlord
    // ----------------------------------------------------------

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    if (user.role !== "LANDLORD") {
      return NextResponse.json(
        { error: "Only landlords can respond to viewing requests." },
        { status: 403 }
      );
    }

    // ----------------------------------------------------------
    // 2. Parse and validate the request
    // ----------------------------------------------------------

    const body = (await request.json().catch(() => null)) as
      | UpdateRequestBody
      | null;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "A viewing request ID is required." },
        { status: 400 }
      );
    }

    const status = body.status;

    if (status !== "ACCEPTED" && status !== "DECLINED") {
      return NextResponse.json(
        { error: "Choose ACCEPTED or DECLINED." },
        { status: 400 }
      );
    }

    let landlordResponse: string | null = null;

    if (body.landlordResponse !== undefined) {
      if (typeof body.landlordResponse !== "string") {
        return NextResponse.json(
          { error: "Your response must be text." },
          { status: 400 }
        );
      }

      landlordResponse = body.landlordResponse.trim() || null;

      if (landlordResponse && landlordResponse.length > 1000) {
        return NextResponse.json(
          { error: "Your response cannot exceed 1000 characters." },
          { status: 400 }
        );
      }
    }

    // ----------------------------------------------------------
    // 3. Confirm the request belongs to this landlord
    // ----------------------------------------------------------

    const existingRequest = await prisma.viewingRequest.findFirst({
      where: {
        id,
        landlordId: user.id,
      },
      select: {
        id: true,
        studentId: true,
        status: true,
        listing: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!existingRequest) {
      return NextResponse.json(
        { error: "Viewing request not found." },
        { status: 404 }
      );
    }

    if (existingRequest.status !== "PENDING") {
      return NextResponse.json(
        {
          error:
            "This request has already been answered. Refresh the page to see its latest status.",
        },
        { status: 409 }
      );
    }

    // ----------------------------------------------------------
    // 4. Update the request and notify the student
    // ----------------------------------------------------------

    const result = await prisma.$transaction(async (tx) => {
      // Only update a request that is still pending and belongs
      // to the authenticated landlord.
      const updateResult = await tx.viewingRequest.updateMany({
        where: {
          id,
          landlordId: user.id,
          status: "PENDING",
        },
        data: {
          status,
          landlordResponse,
          respondedAt: new Date(),
        },
      });

      // Another request may have updated it in the meantime.
      if (updateResult.count === 0) {
        return null;
      }

      const viewingRequest = await tx.viewingRequest.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          status: true,
          landlordResponse: true,
          respondedAt: true,
        },
      });

      if (!viewingRequest) {
        throw new Error(
          "Updated viewing request could not be retrieved."
        );
      }

      const title =
        status === "ACCEPTED"
          ? "Viewing Request Accepted"
          : "Viewing Request Declined";

      const message =
        status === "ACCEPTED"
          ? `Your viewing request for "${existingRequest.listing.title}" has been accepted by the landlord.`
          : `Your viewing request for "${existingRequest.listing.title}" has been declined by the landlord.`;

      const notification = await tx.notification.create({
        data: {
          userId: existingRequest.studentId,
          type:
            status === "ACCEPTED"
              ? "VIEWING_CONFIRMED"
              : "VIEWING_CANCELLED",
          title,
          message,

          link: "/dashboard/student/viewing-requests",
        },
      });

      return {
        viewingRequest,
        notification,
        title,
        message,
      };
    });

    if (!result) {
      return NextResponse.json(
        {
          error:
            "This request has already been answered. Refresh the page.",
        },
        { status: 409 }
      );
    }

    // ----------------------------------------------------------
    // 5. Attempt browser push notification
    // ----------------------------------------------------------

    try {
      await sendPushNotification({
        userId: existingRequest.studentId,
        title: result.title,
        message: result.message,
        link: "/dashboard/student/viewing-requests",
      });
    } catch (error) {
      // Push delivery must not undo a successful database update.
      console.error(
        "Failed to send viewing response push notification:",
        error
      );
    }

    // ----------------------------------------------------------
    // 6. Return the updated request
    // ----------------------------------------------------------

    return NextResponse.json(
      {
        message:
          status === "ACCEPTED"
            ? "Viewing request accepted."
            : "Viewing request declined.",
        viewingRequest: result.viewingRequest,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update viewing request:", error);

    return NextResponse.json(
      { error: "Unable to update the viewing request." },
      { status: 500 }
    );
  }
}