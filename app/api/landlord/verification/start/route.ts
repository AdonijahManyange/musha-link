import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createDiditVerificationSession } from "@/lib/didit";

export async function POST() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (user.role !== "LANDLORD") {
      return NextResponse.json(
        {
          error: "Only landlords can verify their identity.",
        },
        { status: 403 }
      );
    }

    // Create the provider session before marking verification as pending.
    const session = await createDiditVerificationSession(user.id);

    if (!session.url || !session.session_id) {
      console.error("Didit returned an invalid verification session.");

      return NextResponse.json(
        {
          error:
            "Identity verification is temporarily unavailable. Please try again later.",
        },
        { status: 503 }
      );
    }

    await prisma.landlordVerification.upsert({
      where: {
        landlordId: user.id,
      },
      update: {
        status: "PENDING",
        rejectionReason: null,
        reviewedAt: null,
        submittedAt: new Date(),
        diditSessionId: session.session_id,
      },
      create: {
        landlordId: user.id,
        status: "PENDING",
        submittedAt: new Date(),
        diditSessionId: session.session_id,
      },
    });

    // ------------------------------------------------------------
    // RETURN DIDIT SESSION
    // ------------------------------------------------------------

    return NextResponse.json({
      url: session.url,
      sessionId: session.session_id,
    });
  } catch (error) {
    console.error("Didit verification error:", error);

    return NextResponse.json(
      {
        error:
          "Identity verification is temporarily unavailable. Please try again later. If the problem continues, contact support.",
      },
      { status: 503 }
    );
  }
}
