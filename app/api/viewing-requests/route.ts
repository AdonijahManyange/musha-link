import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// ============================================================
// GET — Retrieve viewing requests for the authenticated landlord
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

    // Only landlords can access incoming viewing requests.
    if (user.role !== "LANDLORD") {
      return NextResponse.json(
        {
          error: "Only landlords can access incoming viewing requests.",
        },
        { status: 403 }
      );
    }

    // ----------------------------------------------------------
    // 2. Retrieve requests belonging to this landlord only
    // ----------------------------------------------------------

    const viewingRequests = await prisma.viewingRequest.findMany({
      where: {
        landlordId: user.id,
      },
      select: {
        id: true,
        studentId: true,
        landlordId: true,
        listingId: true,

        // Student contact details saved when the request was created.
        studentName: true,
        studentPhone: true,
        studentEmail: true,

        requestedAt: true,
        note: true,
        status: true,
        landlordResponse: true,
        respondedAt: true,
        createdAt: true,
        updatedAt: true,

        // Property information.
        listing: {
          select: {
            id: true,
            title: true,
            city: true,
            province: true,
            country: true,
            monthlyRent: true,
            roomType: true,
          },
        },
      },
      orderBy: [
        { status: "asc" },
        { requestedAt: "asc" },
      ],
    });

    // ----------------------------------------------------------
    // 3. Return the requests
    // ----------------------------------------------------------

    return NextResponse.json(
      {
        viewingRequests,
        total: viewingRequests.length,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Failed to retrieve landlord viewing requests:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to load viewing requests.",
      },
      { status: 500 }
    );
  }
}