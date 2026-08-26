import { NextResponse } from "next/server";

export async function POST() {
  const response =
    NextResponse.json({
      success: true,
    });

  /*
   * Tell NextAuth that the upcoming
   * Google authentication is a LOGIN attempt,
   * not a signup.
   */
  response.cookies.set(
    "musha_auth_flow",
    "login",
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
   * Make sure an old signup role cannot
   * accidentally affect this login.
   */
  response.cookies.delete(
    "musha_signup_role"
  );

  return response;
}