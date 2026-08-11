import { NextResponse } from "next/server";
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

    /*
     * Always return the same response whether the account exists
     * or not. This prevents email/account enumeration.
     */
    if (!user) {
      return NextResponse.json({
        message:
          "If an account exists for that email, a password reset link has been sent.",
      });
    }

    const token = generateResetToken();
    const tokenHash = hashResetToken(token);
    const expiresAt = getResetTokenExpiration();

    // Remove any previous reset tokens for this user.
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

    /*
     * We are intentionally not sending the email yet.
     * The token is created and stored securely first.
     */
    console.log("Password reset token generated for:", normalizedEmail);

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