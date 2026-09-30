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
    const rejectionReason = body.rejectionReason;

    if (
      action !== "APPROVE" &&
      action !== "REJECT"
    ) {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // GET VERIFICATION
    // ------------------------------------------------------------

    const verification =
      await prisma.landlordVerification.findUnique({
        where: {
          id,
        },
        include: {
          landlord: {
            include: {
              verificationDocuments: true,
            },
          },
        },
      });

    if (!verification) {
      return NextResponse.json(
        { error: "Verification not found" },
        { status: 404 }
      );
    }

    // ------------------------------------------------------------
    // REQUIRED DOCUMENTS
    // ------------------------------------------------------------

    const documents =
      verification.landlord.verificationDocuments;

    const waterBill = documents.find(
      (document) =>
        document.type === "WATER_BILL"
    );

    const electricityBill = documents.find(
      (document) =>
        document.type === "ELECTRICITY_BILL"
    );

    // ------------------------------------------------------------
    // REQUIRE BOTH DOCUMENTS BEFORE REVIEW
    // ------------------------------------------------------------

    if (!waterBill || !electricityBill) {
      return NextResponse.json(
        {
          error:
            "Both a water bill and an electricity bill are required before verification can be reviewed.",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // APPROVE
    // ------------------------------------------------------------

    if (action === "APPROVE") {
      await prisma.$transaction([
        prisma.verificationDocument.updateMany({
          where: {
            userId: verification.landlordId,
            type: {
              in: [
                "WATER_BILL",
                "ELECTRICITY_BILL",
              ],
            },
          },
          data: {
            status: "APPROVED",
            reviewedAt: new Date(),
          },
        }),

        prisma.landlordVerification.update({
          where: {
            id,
          },
          data: {
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

    // ------------------------------------------------------------
    // REJECT
    // ------------------------------------------------------------

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
      prisma.verificationDocument.updateMany({
        where: {
          userId: verification.landlordId,
          type: {
            in: [
              "WATER_BILL",
              "ELECTRICITY_BILL",
            ],
          },
        },
        data: {
          status: "REJECTED",
          reviewedAt: new Date(),
        },
      }),

      prisma.landlordVerification.update({
        where: {
          id,
        },
        data: {
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