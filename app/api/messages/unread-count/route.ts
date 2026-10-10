import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// ============================================================
// GET — Get current user's unread message count
// ============================================================

export async function GET() {
  try {
    // ----------------------------------------------------------
    // Authentication
    // ----------------------------------------------------------

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    // ----------------------------------------------------------
    // Count unread messages addressed to the current user
    // ----------------------------------------------------------

    const unreadCount = await prisma.message.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    });

    // ----------------------------------------------------------
    // Response
    // ----------------------------------------------------------

    return NextResponse.json(
      { unreadCount },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Failed to get unread message count:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to retrieve unread message count.",
      },
      { status: 500 }
    );
  }
}
