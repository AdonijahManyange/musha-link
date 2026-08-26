import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    if (user.role !== "LANDLORD") {
      return NextResponse.json(
        {
          error: "Only landlords can access verification status.",
        },
        {
          status: 403,
        }
      );
    }

    const verification =
      await prisma.landlordVerification.findUnique({
        where: {
          landlordId: user.id,
        },
        include: {
          landlord: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              verified: true,
            },
          },
        },
      });

    if (!verification) {
      return NextResponse.json({
        status: "NOT_STARTED",
        verified: false,
        verification: null,
      });
    }

    return NextResponse.json({
      status: verification.status,
      verified: verification.status === "APPROVED",
      verification: {
        id: verification.id,
        status: verification.status,
        rejectionReason: verification.rejectionReason,
        submittedAt: verification.submittedAt,
        reviewedAt: verification.reviewedAt,
      },
    });
  } catch (error) {
    console.error(
      "Failed to load landlord verification status:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to load verification status.",
      },
      {
        status: 500,
      }
    );
  }
}