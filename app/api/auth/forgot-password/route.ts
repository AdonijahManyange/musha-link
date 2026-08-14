import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import {
  generateResetToken,
  hashResetToken,
  getResetTokenExpiration,
} from "@/lib/password-reset";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    // Don't reveal whether an account exists.
    if (!user) {
      return NextResponse.json({
        message:
          "If an account exists for that email, a password reset link has been sent.",
      });
    }

    const token = generateResetToken();
    const tokenHash = hashResetToken(token);
    const expiresAt = getResetTokenExpiration();

    // Remove previous reset tokens.
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
      },
    });

    await prisma.passwordResetToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!appUrl) {
      throw new Error("NEXT_PUBLIC_APP_URL is not configured.");
    }

    const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: "MushaLink <onboarding@resend.dev>",
      to: normalizedEmail,
      subject: "Reset your MushaLink password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
          <h1 style="color: #1f3b73;">Reset your MushaLink password</h1>

          <p>Hi ${user.name || "there"},</p>

          <p>
            We received a request to reset your MushaLink password.
          </p>

          <p>
            Click the button below to choose a new password.
          </p>

          <p style="margin: 32px 0;">
            <a
              href="${resetUrl}"
              style="
                display: inline-block;
                padding: 14px 24px;
                background-color: #1f3b73;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
              "
            >
              Reset Password
            </a>
          </p>

          <p>
            This link will expire in 1 hour.
          </p>

          <p>
            If you didn't request a password reset, you can safely ignore this email.
          </p>

          <p>
            — The MushaLink Team
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);

      // Don't leave an unusable token in the database.
      await prisma.passwordResetToken.deleteMany({
        where: {
          userId: user.id,
        },
      });

      throw new Error("Failed to send password reset email.");
    }

    return NextResponse.json({
      message:
        "If an account exists for that email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}