import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendNotificationEmail } from "@/lib/email";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getCurrentUser();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (admin.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { id } = await params;
    const body = await request.json();
    const action = body.action;
    const rejectionReason = typeof body.rejectionReason === "string" ? body.rejectionReason.trim() : "";
    if (action !== "APPROVE" && action !== "REJECT") return NextResponse.json({ error: "Invalid action." }, { status: 400 });
    if (action === "REJECT" && !rejectionReason) return NextResponse.json({ error: "Add a short reason so the student knows what to correct." }, { status: 400 });

    const verification = await prisma.studentVerification.findUnique({ where: { id }, include: { user: { select: { id: true, name: true, email: true, role: true } } } });
    if (!verification || verification.user.role !== "STUDENT" || verification.method !== "STUDENT_CARD" || verification.status !== "PENDING" || !verification.cardFilePath) {
      return NextResponse.json({ error: "Pending student-card review not found." }, { status: 404 });
    }

    const approved = action === "APPROVE";
    const { error: removalError } = await supabaseAdmin.storage
      .from("verification-documents")
      .remove([verification.cardFilePath]);
    if (removalError) {
      console.error("Reviewed student card cleanup failed:", removalError);
      return NextResponse.json({ error: "Could not securely delete the submitted card. The review was not completed; please try again." }, { status: 500 });
    }

    await prisma.$transaction([
      prisma.studentVerification.update({
        where: { id },
        data: {
          status: approved ? "APPROVED" : "REJECTED",
          rejectionReason: approved ? null : rejectionReason,
          reviewedAt: new Date(),
          reviewedById: admin.id,
          cardFilePath: null,
          cardFileName: null,
        },
      }),
      prisma.notification.create({
        data: {
          userId: verification.userId,
          type: approved ? "VERIFICATION_APPROVED" : "VERIFICATION_REJECTED",
          title: approved ? "Student status verified" : "Student card needs attention",
          message: approved ? "Your student status has been verified." : `Your student card could not be approved. ${rejectionReason}`,
          link: "/dashboard/student/verification",
        },
      }),
    ]);

    try {
      await sendNotificationEmail({
        to: verification.user.email,
        subject: approved ? "Your student status is verified" : "Action needed for student verification",
        title: approved ? "Student status verified" : "Student card needs attention",
        message: approved ? "Your student status has been verified on MushaLink." : `Your student card could not be approved. ${rejectionReason}`,
        actionUrl: "/dashboard/student/verification",
        actionText: "View student verification",
      });
    } catch (emailError) {
      console.error("Student verification decision email failed:", emailError);
    }

    return NextResponse.json({ success: true, status: approved ? "APPROVED" : "REJECTED" });
  } catch (error) {
    console.error("Student verification review error:", error);
    return NextResponse.json({ error: "Could not save the review decision." }, { status: 500 });
  }
}
