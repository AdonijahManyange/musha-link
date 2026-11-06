import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { sendPushNotification } from "@/lib/push-notifications";

// ============================================================
// POST — Save browser push subscription
// ============================================================

export async function POST(request: Request) {
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
        {
          status: 401,
        }
      );
    }

    // ----------------------------------------------------------
    // Request body
    // ----------------------------------------------------------

    const body = await request.json();

    const endpoint = body?.endpoint;
    const p256dh = body?.keys?.p256dh;
    const auth = body?.keys?.auth;

    if (
      typeof endpoint !== "string" ||
      typeof p256dh !== "string" ||
      typeof auth !== "string" ||
      !endpoint ||
      !p256dh ||
      !auth
    ) {
      return NextResponse.json(
        {
          error: "Invalid push subscription.",
        },
        {
          status: 400,
        }
      );
    }

    // ----------------------------------------------------------
    // Save subscription
    //
    // The endpoint is unique because it identifies this specific
    // browser push subscription.
    // ----------------------------------------------------------

    const existingSubscription = await prisma.pushSubscription.findUnique({
      where: { endpoint },
      select: { userId: true },
    });

    const subscription =
      await prisma.pushSubscription.upsert({
        where: {
          endpoint,
        },

        update: {
          userId: user.id,
          p256dh,
          auth,
        },

        create: {
          userId: user.id,
          endpoint,
          p256dh,
          auth,
        },
      });

    // Send the signup verification reminder once when this browser is first
    // linked to the signed-in account. The user has already granted permission
    // before the client attempts to save a browser push subscription.
    if (existingSubscription?.userId !== user.id) {
      let reminder: { title: string; message: string; link: string } | null = null;

      if (user.role === "STUDENT") {
        const verification = await prisma.studentVerification.findUnique({
          where: { userId: user.id },
          select: { status: true },
        });
        if (verification?.status !== "APPROVED") {
          reminder = {
            title: "Verify your student status",
            message: "Verify your student status to contact landlords and request property viewings.",
            link: "/dashboard/student/verification",
          };
        }
      } else if (user.role === "LANDLORD") {
        const verification = await prisma.landlordVerification.findUnique({
          where: { landlordId: user.id },
          select: { status: true },
        });
        if (verification?.status !== "APPROVED") {
          reminder = {
            title: "Complete landlord verification",
            message: "Complete landlord verification to publish listings and connect with students.",
            link: "/dashboard/landlord/verification",
          };
        }
      }

      if (reminder) {
        await sendPushNotification({ userId: user.id, ...reminder });
      }
    }

    // ----------------------------------------------------------
    // Success
    // ----------------------------------------------------------

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
    });
  } catch (error) {
    console.error(
      "Failed to save push subscription:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to save push subscription.",
      },
      {
        status: 500,
      }
    );
  }
}
