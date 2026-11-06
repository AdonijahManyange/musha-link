import { createHmac, randomInt } from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase-admin";

function hashCode(userId: string, code: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not configured.");
  return createHmac("sha256", secret).update(`${userId}:${code}`).digest("hex");
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
    if (user.role !== "STUDENT") return NextResponse.json({ error: "Only students can verify student status." }, { status: 403 });

    const body = await request.json();
    const schoolEmail = typeof body.schoolEmail === "string" ? body.schoolEmail.trim().toLowerCase() : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(schoolEmail) || schoolEmail.length > 254) {
      return NextResponse.json({ error: "Enter a valid school email address." }, { status: 400 });
    }

    const universityProfile = await prisma.studentProfile.findUnique({
      where: { userId: user.id },
      select: { university: { select: { name: true } } },
    });
    const universityName = universityProfile?.university?.name;
    if (!universityName) {
      return NextResponse.json({ error: "Select your university in your student profile before verifying your school email." }, { status: 400 });
    }

    let domainsByUniversity: Record<string, string[]>;
    try {
      domainsByUniversity = JSON.parse(process.env.STUDENT_UNIVERSITY_EMAIL_DOMAINS ?? "{}");
    } catch {
      console.error("STUDENT_UNIVERSITY_EMAIL_DOMAINS must be valid JSON.");
      return NextResponse.json({ error: "School email verification is not configured yet. Please submit a student card instead." }, { status: 503 });
    }
    const allowedDomains = (domainsByUniversity[universityName] ?? [])
      .map((domain) => domain.trim().toLowerCase().replace(/^@/, ""))
      .filter(Boolean);
    if (allowedDomains.length === 0) {
      return NextResponse.json({ error: `School email verification is not configured for ${universityName} yet. Please submit a student card instead.` }, { status: 503 });
    }
    const emailDomain = schoolEmail.split("@").pop()!;
    if (!allowedDomains.some((domain) => emailDomain === domain || emailDomain.endsWith(`.${domain}`))) {
      return NextResponse.json({ error: "That school's email domain is not supported yet. You can submit a student card for review." }, { status: 400 });
    }

    const existing = await prisma.studentVerification.findUnique({ where: { userId: user.id } });
    if (existing?.status === "APPROVED") {
      return NextResponse.json({ error: "Your student status is already verified." }, { status: 409 });
    }
    if (existing?.emailCodeSentAt && Date.now() - existing.emailCodeSentAt.getTime() < 60_000) {
      return NextResponse.json({ error: "Please wait one minute before requesting another code." }, { status: 429 });
    }

    const code = randomInt(0, 100_000_000).toString().padStart(8, "0");
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) throw new Error("RESEND_API_KEY is not configured.");

    const resend = new Resend(resendApiKey);
    const { error: emailError } = await resend.emails.send({
      from: "MushaLink <notifications@mushalink.com>",
      to: schoolEmail,
      subject: "Your MushaLink student verification code",
      text: `Your MushaLink verification code is ${code}. It expires in 10 minutes. If you did not request this code, you can ignore this email.`,
      html: `<p>Your MushaLink student verification code is:</p><p style="font-size:28px;font-weight:bold;letter-spacing:4px">${code}</p><p>This code expires in 10 minutes. If you did not request it, you can ignore this email.</p>`,
    });

    if (emailError) {
      console.error("Student verification code email failed:", emailError);
      return NextResponse.json({ error: "Could not send a code to that address. Check the address and try again." }, { status: 502 });
    }

    await prisma.studentVerification.upsert({
      where: { userId: user.id },
      update: {
        method: "SCHOOL_EMAIL",
        status: "PENDING",
        schoolEmail,
        emailCodeHash: hashCode(user.id, code),
        emailCodeExpiresAt: new Date(Date.now() + 10 * 60_000),
        emailCodeSentAt: new Date(),
        emailCodeAttempts: 0,
        cardFilePath: null,
        cardFileName: null,
        rejectionReason: null,
        reviewedAt: null,
        reviewedById: null,
      },
      create: {
        userId: user.id,
        method: "SCHOOL_EMAIL",
        status: "PENDING",
        schoolEmail,
        emailCodeHash: hashCode(user.id, code),
        emailCodeExpiresAt: new Date(Date.now() + 10 * 60_000),
        emailCodeSentAt: new Date(),
      },
    });

    if (existing?.cardFilePath) {
      const { error: cleanupError } = await supabaseAdmin.storage
        .from("verification-documents")
        .remove([existing.cardFilePath]);
      if (cleanupError) console.error("Replaced student card cleanup failed:", cleanupError);
    }

    return NextResponse.json({ success: true, message: "Verification code sent." });
  } catch (error) {
    console.error("Student email verification error:", error);
    return NextResponse.json({ error: "Could not start email verification." }, { status: 500 });
  }
}
