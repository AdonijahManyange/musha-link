import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("========== DIDIT WEBHOOK ==========");
    console.log("Full payload:", JSON.stringify(body, null, 2));

    const sessionId = body.session_id;
    const status = body.status;
    const vendorData = body.vendor_data;

    console.log("session_id:", sessionId);
    console.log("status:", status);
    console.log("vendor_data:", vendorData);

    if (!sessionId || !status || !vendorData) {
      console.error("Missing required Didit webhook fields.");

      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 400 }
      );
    }

    const verification =
      await prisma.landlordVerification.findUnique({
        where: {
          landlordId: vendorData,
        },
      });

    console.log(
      "Verification found:",
      verification
        ? {
            id: verification.id,
            landlordId: verification.landlordId,
            diditSessionId: verification.diditSessionId,
          }
        : null
    );

    if (!verification) {
      console.error(
        `No verification record found for landlord ${vendorData}`
      );

      return NextResponse.json(
        { error: "Verification record not found" },
        { status: 404 }
      );
    }

    // ------------------------------------------------------------
    // APPROVED
    // ------------------------------------------------------------

    if (status === "Approved") {
      const updated =
        await prisma.landlordVerification.update({
          where: {
            landlordId: vendorData,
          },
          data: {
            diditSessionId: sessionId,
            identityVerified: true,
            livenessVerified: true,
            faceMatchVerified: true,

            // Still requires title deed approval.
            status: "PENDING",
            rejectionReason: null,
          },
        });

      console.log("✅ DIDIT APPROVED");
      console.log({
        identityVerified: updated.identityVerified,
        livenessVerified: updated.livenessVerified,
        faceMatchVerified: updated.faceMatchVerified,
        status: updated.status,
      });
    }

    // ------------------------------------------------------------
    // DECLINED
    // ------------------------------------------------------------

    else if (status === "Declined") {
      await prisma.landlordVerification.update({
        where: {
          landlordId: vendorData,
        },
        data: {
          diditSessionId: sessionId,
          identityVerified: false,
          livenessVerified: false,
          faceMatchVerified: false,
          status: "REJECTED",
          reviewedAt: new Date(),
        },
      });

      await prisma.user.update({
        where: {
          id: vendorData,
        },
        data: {
          verified: false,
        },
      });

      console.log("❌ DIDIT DECLINED");
    }

    // ------------------------------------------------------------
    // MANUAL REVIEW
    // ------------------------------------------------------------

    else if (status === "In Review") {
      await prisma.landlordVerification.update({
        where: {
          landlordId: vendorData,
        },
        data: {
          diditSessionId: sessionId,
          status: "ACTION_REQUIRED",
        },
      });

      console.log("⚠️ DIDIT IN REVIEW");
    }

    // ------------------------------------------------------------
    // RESUBMITTED
    // ------------------------------------------------------------

    else if (status === "Resubmitted") {
      await prisma.landlordVerification.update({
        where: {
          landlordId: vendorData,
        },
        data: {
          diditSessionId: sessionId,
          status: "PENDING",
        },
      });

      console.log("🔄 DIDIT RESUBMITTED");
    }

    // ------------------------------------------------------------
    // UNKNOWN STATUS
    // ------------------------------------------------------------

    else {
      console.warn(
        `⚠️ Unknown Didit status received: "${status}"`
      );
    }

    console.log("========== END DIDIT WEBHOOK ==========");

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error("❌ DIDIT WEBHOOK ERROR:", error);

    return NextResponse.json(
      {
        error: "Webhook processing failed",
      },
      { status: 500 }
    );
  }
}