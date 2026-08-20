import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createSoveraVerificationSession } from "@/lib/sovera";

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

    const session =
      await createSoveraVerificationSession(user.id);

    if (!session.hostedUrl) {
      console.error("Unexpected Sovera response:", session);

      return NextResponse.json(
        {
          error:
            "Sovera did not return a hosted verification URL.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      url: session.hostedUrl,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Sovera verification error:", error);

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