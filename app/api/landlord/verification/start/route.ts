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

    // ------------------------------------------------------------
// CREATE / RESET LANDLORD VERIFICATION
// ------------------------------------------------------------

const verification = await prisma.landlordVerification.upsert({
  where: {
    landlordId: user.id,
  },
  update: {
    status: "PENDING",
    rejectionReason: null,
    reviewedAt: null,
    submittedAt: new Date(),
  },
  create: {
    landlordId: user.id,
    status: "PENDING",
    submittedAt: new Date(),
  },
});

// ------------------------------------------------------------
// CREATE DIDIT VERIFICATION SESSION
// ------------------------------------------------------------

const session = await createDiditVerificationSession(user.id);

if (!session.url || !session.session_id) {
  console.error("Unexpected Didit response:", session);

  return NextResponse.json(
    {
      error: "Didit did not return a valid verification session.",
    },
    { status: 502 }
  );
}

// ------------------------------------------------------------
// SAVE DIDIT SESSION ID
// ------------------------------------------------------------

await prisma.landlordVerification.update({
  where: {
    id: verification.id,
  },
  data: {
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
          error instanceof Error
            ? error.message
            : "Unable to start verification.",
      },
      { status: 500 }
    );
  }
}