import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("DIDit webhook received:", body);

    const {
      session_id,
      status,
      vendor_data,
    } = body;

    if (!session_id || !status || !vendor_data) {
      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // APPROVED
    // ------------------------------------------------------------

    if (status === "Approved") {
      await prisma.$transaction([
        prisma.landlordVerification.update({
          where: {
            landlordId: vendor_data,
          },
          data: {
            status: "APPROVED",
            reviewedAt: new Date(),
          },
        }),

        prisma.user.update({
          where: {
            id: vendor_data,
          },
          data: {
            verified: true,
          },
        }),
      ]);

      console.log(
        `DIDit verification approved for landlord ${vendor_data}`
      );
    }

    // ------------------------------------------------------------
    // DECLINED
    // ------------------------------------------------------------

    else if (status === "Declined") {
      await prisma.landlordVerification.update({
        where: {
          landlordId: vendor_data,
        },
        data: {
          status: "REJECTED",
          reviewedAt: new Date(),
        },
      });

      await prisma.user.update({
        where: {
          id: vendor_data,
        },
        data: {
          verified: false,
        },
      });

      console.log(
        `DIDit verification declined for landlord ${vendor_data}`
      );
    }

    // ------------------------------------------------------------
    // MANUAL REVIEW
    // ------------------------------------------------------------

    else if (status === "In Review") {
      await prisma.landlordVerification.update({
        where: {
          landlordId: vendor_data,
        },
        data: {
          status: "ACTION_REQUIRED",
        },
      });

      console.log(
        `DIDit verification requires review for landlord ${vendor_data}`
      );
    }

    // ------------------------------------------------------------
    // RESUBMITTED
    // ------------------------------------------------------------

    else if (status === "Resubmitted") {
      await prisma.landlordVerification.update({
        where: {
          landlordId: vendor_data,
        },
        data: {
          status: "ACTION_REQUIRED",
        },
      });

      console.log(
        `DIDit verification resubmitted for landlord ${vendor_data}`
      );
    }

    // ------------------------------------------------------------
    // OTHER STATUS
    // ------------------------------------------------------------

    else {
      console.log(
        `DIDit status received: ${status}`
      );
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error("DIDit webhook error:", error);

    return NextResponse.json(
      {
        error: "Webhook processing failed",
      },
      { status: 500 }
    );
  }
}