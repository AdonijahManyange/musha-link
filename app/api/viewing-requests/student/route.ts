import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// ============================================================
// GET — Retrieve the authenticated student's viewing requests
// ============================================================

export async function GET() {
  try {
    // ----------------------------------------------------------
    // 1. Authenticate the student
    // ----------------------------------------------------------

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to view your requests." },
        { status: 401 }
      );
    }

    if (user.role !== "STUDENT") {
      return NextResponse.json(
        {
          error: "Only student accounts can view student requests.",
        },
        { status: 403 }
      );
    }

    // ----------------------------------------------------------
    // 2. Retrieve requests belonging to this student only
    // ----------------------------------------------------------

    const viewingRequests = await prisma.viewingRequest.findMany({
      where: {
        studentId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        requestedAt: true,
        note: true,
        status: true,
        landlordResponse: true,
        respondedAt: true,
        createdAt: true,

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

        landlord: {
          select: {
            name: true,
          },
        },
      },
    });

    // ----------------------------------------------------------
    // 3. Return the requests
    // ----------------------------------------------------------

    return NextResponse.json(
      {
        viewingRequests,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Failed to retrieve student viewing requests:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to load your viewing requests.",
      },
      { status: 500 }
    );
  }
}