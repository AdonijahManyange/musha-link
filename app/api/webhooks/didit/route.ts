import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNotificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const sessionId = body.session_id;
    const status = body.status;
    const vendorData = body.vendor_data;

    console.log("========== DIDIT WEBHOOK ==========");
    console.log("Status:", status);
    console.log("Session ID:", sessionId);

    // Validate the required Didit fields before accessing the database.
    if (!sessionId || !status || !vendorData) {
      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 400 }
      );
    }

    const verification = await prisma.landlordVerification.findUnique({
      where: {
        landlordId: vendorData,
      },
    });

    if (!verification) {
      console.error("No verification record found for the landlord.");

      return NextResponse.json(
        { error: "Verification record not found" },
        { status: 404 }
      );
    }

    // ------------------------------------------------------------
    // APPROVED
    // ------------------------------------------------------------

    if (status === "Approved") {
      // Record Didit's approval without making the final MushaLink decision.
      await prisma.landlordVerification.update({
        where: {
          landlordId: vendorData,
        },
        data: {
          diditSessionId: sessionId,
          identityVerified: true,
          livenessVerified: true,
          faceMatchVerified: true,
          status: "PENDING",
          rejectionReason: null,
        },
      });

      const adminEmail = process.env.ADMIN_EMAIL;

      if (!adminEmail) {
        console.error("ADMIN_EMAIL is not configured.");

        return NextResponse.json(
          { error: "Admin notification is not configured" },
          { status: 500 }
        );
      }

      // Claim the notification atomically. Only one concurrent request can
      // change the claim from null to a timestamp.
      const claimTime = new Date();

      const claim = await prisma.landlordVerification.updateMany({
        where: {
          landlordId: vendorData,
          adminNotifiedAt: null,
          adminNotificationClaimedAt: null,
        },
        data: {
          adminNotificationClaimedAt: claimTime,
        },
      });

      if (claim.count === 1) {
        try {
          const landlord = await prisma.user.findUnique({
            where: {
              id: vendorData,
            },
            select: {
              name: true,
              email: true,
            },
          });

          if (!landlord) {
            throw new Error("Landlord account not found.");
          }

          await sendNotificationEmail({
            to: adminEmail,
            subject: "MushaLink: Landlord identity verification approved",
            title: "Landlord verification needs your review",
            message:
              `Didit has approved the identity checks for ${landlord.name || "a landlord"} ` +
              `(${landlord.email}). The landlord's MushaLink verification remains pending ` +
              "until you complete the manual review. Please review the verification and " +
              "any required property documents.",
            actionUrl: "/dashboard/admin/verifications",
            actionText: "Review Landlord Verification",
          });

          // Mark the notification as sent only after the email helper succeeds.
          await prisma.landlordVerification.updateMany({
            where: {
              landlordId: vendorData,
              adminNotificationClaimedAt: claimTime,
            },
            data: {
              adminNotifiedAt: new Date(),
              adminNotificationClaimedAt: null,
            },
          });

          console.log("Admin verification notification sent.");
        } catch (emailError) {
          // Release only the claim owned by this request so a retry can try again.
          await prisma.landlordVerification.updateMany({
            where: {
              landlordId: vendorData,
              adminNotificationClaimedAt: claimTime,
            },
            data: {
              adminNotificationClaimedAt: null,
            },
          });

          console.error("Failed to notify admin:", emailError);

          return NextResponse.json(
            { error: "Admin notification failed" },
            { status: 500 }
          );
        }
      } else {
        console.log(
          "Admin notification already claimed or previously sent; skipping."
        );
      }
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

      console.log("Didit declined the identity verification.");
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

      console.log("Didit requires additional review.");
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

      console.log("Didit verification was resubmitted.");
    }

    else {
      console.warn(`Unknown Didit status received: "${status}"`);
    }

    console.log("========== END DIDIT WEBHOOK ==========");

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Didit webhook processing failed:", error);

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}