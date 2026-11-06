import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request
) {
  try {
    const { role, universityId, schoolEmail, verificationMethod } =
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

    let validatedUniversityId = "";
    let normalizedSchoolEmail = "";
    let studentVerificationMethod: "SCHOOL_EMAIL" | "STUDENT_CARD" = "SCHOOL_EMAIL";
    if (role === "STUDENT") {
      studentVerificationMethod = verificationMethod === "STUDENT_CARD" ? "STUDENT_CARD" : "SCHOOL_EMAIL";
      normalizedSchoolEmail = typeof schoolEmail === "string" ? schoolEmail.trim().toLowerCase() : "";
      if (typeof universityId !== "string" || (studentVerificationMethod === "SCHOOL_EMAIL" && (!normalizedSchoolEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedSchoolEmail)))) {
        return NextResponse.json({ error: "Select your university and enter a valid school email or choose student card review." }, { status: 400 });
      }
      const university = await prisma.university.findUnique({ where: { id: universityId }, select: { id: true } });
      if (!university) return NextResponse.json({ error: "Select a valid university." }, { status: 400 });
      validatedUniversityId = university.id;
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

    if (role === "STUDENT") {
      response.cookies.set("musha_signup_university", validatedUniversityId, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 10 * 60, path: "/" });
      response.cookies.set("musha_signup_school_email", normalizedSchoolEmail, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 10 * 60, path: "/" });
      response.cookies.set("musha_signup_verification_method", studentVerificationMethod, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 10 * 60, path: "/" });
    }

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
