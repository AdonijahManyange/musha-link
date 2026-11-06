import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendNotificationEmail } from "@/lib/email";

const BUCKET = "verification-documents";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
    if (user.role !== "STUDENT") return NextResponse.json({ error: "Only students can submit student cards." }, { status: 403 });

    const formData = await request.formData();
    const file = formData.get("file");
    const consent = formData.get("consent");
    if (consent !== "yes") return NextResponse.json({ error: "Consent is required to review the student card." }, { status: 400 });
    if (!(file instanceof File)) return NextResponse.json({ error: "Choose a student card image or PDF." }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: "Upload a PDF, JPG, PNG, or WEBP file." }, { status: 400 });
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "The file must be 10 MB or smaller." }, { status: 400 });

    const previous = await prisma.studentVerification.findUnique({ where: { userId: user.id } });
    if (previous?.status === "APPROVED") return NextResponse.json({ error: "Your student status is already verified." }, { status: 409 });

    const extension = file.type === "application/pdf" ? "pdf" : file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const filePath = `students/${user.id}/student-card/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabaseAdmin.storage.from(BUCKET).upload(filePath, Buffer.from(await file.arrayBuffer()), {
      contentType: file.type,
      upsert: false,
    });
    if (uploadError) {
      console.error("Student card upload failed:", uploadError);
      return NextResponse.json({ error: "Could not upload the student card." }, { status: 500 });
    }

    await prisma.studentVerification.upsert({
      where: { userId: user.id },
      update: {
        method: "STUDENT_CARD",
        status: "PENDING",
        schoolEmail: null,
        emailCodeHash: null,
        emailCodeExpiresAt: null,
        emailCodeSentAt: null,
        emailCodeAttempts: 0,
        cardFilePath: filePath,
        cardFileName: file.name,
        rejectionReason: null,
        reviewedAt: null,
        reviewedById: null,
      },
      create: {
        userId: user.id,
        method: "STUDENT_CARD",
        status: "PENDING",
        cardFilePath: filePath,
        cardFileName: file.name,
      },
    });

    try {
      const [admins, student] = await Promise.all([
        prisma.user.findMany({ where: { role: "ADMIN" }, select: { id: true } }),
        prisma.user.findUnique({
          where: { id: user.id },
          select: { name: true, email: true, studentProfile: { select: { university: { select: { name: true } } } } },
        }),
      ]);

      if (admins.length > 0) {
        await prisma.notification.createMany({
          data: admins.map((admin) => ({
            userId: admin.id,
            type: "SYSTEM",
            title: "Student card needs review",
            message: `${student?.name || "A student"} submitted a student card for ${student?.studentProfile?.university?.name || "their university"}.`,
            link: "/dashboard/admin/student-verifications",
          })),
        });
      }

      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail && student) {
        try {
          await sendNotificationEmail({
            to: adminEmail,
            subject: "MushaLink: Student card needs review",
            title: "A student submitted a card for review",
            message: `${student.name || "A student"} (${student.email}) from ${student.studentProfile?.university?.name || "an unlisted university"} submitted a student card. Please review it in the admin dashboard.`,
            actionUrl: "/dashboard/admin/student-verifications",
            actionText: "Review student card",
          });
        } catch (emailError) {
          console.error("Student card admin email notification failed:", emailError);
        }
      } else if (!adminEmail) {
        console.error("ADMIN_EMAIL is not configured; student card email alert was skipped.");
      }
    } catch (notificationError) {
      console.error("Student card admin notification failed:", notificationError);
    }

    if (previous?.cardFilePath) {
      const { error } = await supabaseAdmin.storage.from(BUCKET).remove([previous.cardFilePath]);
      if (error) console.error("Previous student card cleanup failed:", error);
    }

    return NextResponse.json({ success: true, status: "PENDING" }, { status: 201 });
  } catch (error) {
    console.error("Student card submission error:", error);
    return NextResponse.json({ error: "Could not submit the student card." }, { status: 500 });
  }
}
