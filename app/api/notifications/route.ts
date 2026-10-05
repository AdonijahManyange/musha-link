import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// ============================================================
// GET — Get current user's notifications
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
    // Get notifications
    // ----------------------------------------------------------

    const notifications =
      await prisma.notification.findMany({
        where: {
          userId: user.id,
        },

        orderBy: {
          createdAt: "desc",
        },

        take: 50,
      });

    // ----------------------------------------------------------
    // Get unread count
    // ----------------------------------------------------------

    const unreadCount =
      await prisma.notification.count({
        where: {
          userId: user.id,
          read: false,
        },
      });

    // ----------------------------------------------------------
    // Response
    // ----------------------------------------------------------

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error(
      "Failed to load notifications:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while loading notifications.",
      },
      { status: 500 }
    );
  }
}

// ============================================================
// PATCH — Mark all notifications as read
// ============================================================

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const notificationId = body.notificationId;

    // Mark one notification as read
    if (notificationId) {
      const result =
        await prisma.notification.updateMany({
          where: {
            id: notificationId,
            userId: user.id,
            read: false,
          },
          data: {
            read: true,
          },
        });

      return NextResponse.json({
        message: "Notification marked as read.",
        updatedCount: result.count,
      });
    }

    // Mark all notifications as read
    const result =
      await prisma.notification.updateMany({
        where: {
          userId: user.id,
          read: false,
        },
        data: {
          read: true,
        },
      });

    return NextResponse.json({
      message: "Notifications marked as read.",
      updatedCount: result.count,
    });
  } catch (error) {
    console.error(
      "Failed to mark notification(s) as read:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while marking notifications as read.",
      },
      { status: 500 }
    );
  }
}