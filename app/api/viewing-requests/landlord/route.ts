import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// ============================================================
// GET — Retrieve viewing requests for the authenticated landlord
// ============================================================

export async function GET() {
  try {
    // Authenticate the current user.
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to view viewing requests." },
        { status: 401 }
      );
    }

    // Only landlords can access this endpoint.
    if (user.role !== "LANDLORD") {
      return NextResponse.json(
        { error: "Only landlords can view these requests." },
        { status: 403 }
      );
    }

    // Retrieve only requests assigned to this landlord.
    const viewingRequests = await prisma.viewingRequest.findMany({
      where: {
        landlordId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        studentId: true,
        studentName: true,
        studentPhone: true,
        studentEmail: true,
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
      },
    });

    return NextResponse.json(
      {
        viewingRequests,
        total: viewingRequests.length,
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
      "Failed to retrieve landlord viewing requests:",
      error
    );

    return NextResponse.json(
      { error: "Unable to load viewing requests." },
      { status: 500 }
    );
  }
}