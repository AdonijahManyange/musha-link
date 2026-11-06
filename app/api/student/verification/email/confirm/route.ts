import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function hashCode(userId: string, code: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not configured.");
  return createHmac("sha256", secret).update(`${userId}:${code}`).digest();
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
    if (user.role !== "STUDENT") return NextResponse.json({ error: "Only students can verify student status." }, { status: 403 });

    const body = await request.json();
    const code = typeof body.code === "string" ? body.code.trim() : "";
    if (!/^\d{8}$/.test(code)) return NextResponse.json({ error: "Enter the 8-digit code." }, { status: 400 });

    const verification = await prisma.studentVerification.findUnique({ where: { userId: user.id } });
    if (!verification?.emailCodeHash || !verification.emailCodeExpiresAt) {
      return NextResponse.json({ error: "Request a verification code first." }, { status: 400 });
    }
    if (verification.emailCodeAttempts >= 5) {
      return NextResponse.json({ error: "Too many incorrect attempts. Request a new code." }, { status: 429 });
    }
    if (verification.emailCodeExpiresAt.getTime() < Date.now()) {
      return NextResponse.json({ error: "That code expired. Request a new one." }, { status: 400 });
    }

    const expected = Buffer.from(verification.emailCodeHash, "hex");
    const supplied = hashCode(user.id, code);
    const matches = expected.length === supplied.length && timingSafeEqual(expected, supplied);
    if (!matches) {
      await prisma.studentVerification.update({
        where: { userId: user.id },
        data: { emailCodeAttempts: { increment: 1 } },
      });
      return NextResponse.json({ error: "That code is incorrect." }, { status: 400 });
    }

    await prisma.studentVerification.update({
      where: { userId: user.id },
      data: {
        status: "APPROVED",
        emailCodeHash: null,
        emailCodeExpiresAt: null,
        emailCodeSentAt: null,
        emailCodeAttempts: 0,
        reviewedAt: new Date(),
        rejectionReason: null,
      },
    });

    return NextResponse.json({ success: true, status: "APPROVED" });
  } catch (error) {
    console.error("Student email code confirmation error:", error);
    return NextResponse.json({ error: "Could not confirm the verification code." }, { status: 500 });
  }
}
