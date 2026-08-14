import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/hash";
import { createSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and password are required.",
        },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }

    // Google accounts don't have a password.
    if (!user.password) {
      return NextResponse.json(
        {
          error:
            "This account uses Google sign-in. Please continue with Google.",
        },
        {
          status: 401,
        }
      );
    }

    const passwordMatches = await comparePassword(
      password,
      user.password
    );

    if (!passwordMatches) {
      return NextResponse.json(
        {
          error: "Invalid email or password.",
        },
        {
          status: 401,
        }
      );
    }

    const sessionToken = await createSession({
      userId: user.id,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        message: "Login successful.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      {
        status: 200,
      }
    );

    response.cookies.set({
      name: "musha_session",
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error(error);

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