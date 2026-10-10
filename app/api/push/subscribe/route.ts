import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

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