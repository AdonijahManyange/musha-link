import { NextResponse } from "next/server";

export async function POST(
  request: Request
) {
  try {
    const { role } =
      await request.json();

    if (
      role !== "STUDENT" &&
      role !== "LANDLORD"
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid account type.",
        },
        {
          status: 400,
        }
      );
    }

    const response =
      NextResponse.json({
        success: true,
      });

    /*
     * Remember which account type the user selected.
     */
    response.cookies.set(
      "musha_signup_role",
      role,
      {
        httpOnly: true,
        sameSite: "lax",
        secure:
          process.env.NODE_ENV ===
          "production",
        maxAge: 10 * 60,
        path: "/",
      }
    );

    /*
     * Explicitly tell the authentication
     * system this is a SIGNUP flow.
     */
    response.cookies.set(
      "musha_auth_flow",
      "signup",
      {
        httpOnly: true,
        sameSite: "lax",
        secure:
          process.env.NODE_ENV ===
          "production",
        maxAge: 10 * 60,
        path: "/",
      }
    );

    return response;
  } catch {
    return NextResponse.json(
      {
        error:
          "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}