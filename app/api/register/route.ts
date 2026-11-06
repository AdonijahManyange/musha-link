import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/hash";

export async function POST(request: Request) {
  try {
    const { name, email, password, role, universityId, schoolEmail, verificationMethod } = await request.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (role !== "STUDENT" && role !== "LANDLORD") {
      return NextResponse.json({ error: "Choose Student or Landlord." }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedSchoolEmail = typeof schoolEmail === "string" ? schoolEmail.trim().toLowerCase() : "";
    const studentVerificationMethod = verificationMethod === "STUDENT_CARD" ? "STUDENT_CARD" : "SCHOOL_EMAIL";
    let studentUniversityId: string | null = null;
    if (role === "STUDENT") {
      if (!universityId || (studentVerificationMethod === "SCHOOL_EMAIL" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedSchoolEmail))) {
        return NextResponse.json({ error: "Select a university and enter a valid school email or choose student card review." }, { status: 400 });
      }
      const university = await prisma.university.findUnique({ where: { id: universityId }, select: { id: true } });
      if (!university) return NextResponse.json({ error: "Select a valid university." }, { status: 400 });
      studentUniversityId = university.id;
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.create({
      data: {
        name: String(name).trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role,
        ...(role === "STUDENT" && studentUniversityId ? {
          studentProfile: { create: { universityId: studentUniversityId } },
          studentVerification: { create: { method: studentVerificationMethod, schoolEmail: normalizedSchoolEmail || null } },
        } : {}),
        notifications: {
          create: {
            type: "SYSTEM",
            title: role === "STUDENT" ? "Verify your student status" : "Complete landlord verification",
            message: role === "STUDENT"
              ? "Verify your student status to contact landlords and request property viewings."
              : "Complete landlord verification to publish listings and connect with students.",
            link: role === "STUDENT"
              ? "/dashboard/student/verification"
              : "/dashboard/landlord/verification",
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Account created successfully.",
      },
      {
        status: 201,
      }
    );
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
