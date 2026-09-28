import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: Props
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const body = await request.json();

    const action = body.action;
    const rejectionReason =
      body.rejectionReason;

    if (
      action !== "APPROVE" &&
      action !== "REJECT"
    ) {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    const verification =
      await prisma.landlordVerification.findUnique({
        where: {
          id,
        },
      });

    if (!verification) {
      return NextResponse.json(
        { error: "Verification not found" },
        { status: 404 }
      );
    }

    if (!verification.titleDeedUrl) {
      return NextResponse.json(
        {
          error:
            "A title deed must be uploaded before review.",
        },
        { status: 400 }
      );
    }

    if (action === "APPROVE") {
      await prisma.$transaction([
        prisma.landlordVerification.update({
          where: {
            id,
          },
          data: {
            titleDeedStatus: "APPROVED",
            status: "APPROVED",
            reviewedById: user.id,
            reviewedAt: new Date(),
            rejectionReason: null,
          },
        }),

        prisma.user.update({
          where: {
            id: verification.landlordId,
          },
          data: {
            verified: true,
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        status: "APPROVED",
      });
    }

    if (
      !rejectionReason ||
      typeof rejectionReason !== "string" ||
      !rejectionReason.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "A rejection reason is required.",
        },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.landlordVerification.update({
        where: {
          id,
        },
        data: {
          titleDeedStatus: "REJECTED",
          status: "REJECTED",
          reviewedById: user.id,
          reviewedAt: new Date(),
          rejectionReason:
            rejectionReason.trim(),
        },
      }),

      prisma.user.update({
        where: {
          id: verification.landlordId,
        },
        data: {
          verified: false,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      status: "REJECTED",
    });
  } catch (error) {
    console.error(
      "Admin verification update error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update verification.",
      },
      { status: 500 }
    );
  }
}