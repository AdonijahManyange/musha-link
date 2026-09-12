import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/* ============================================================
   GET — Current student profile
============================================================ */

export async function GET() {
  try {
    const session = await auth();
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        verified: true,

        studentProfile: {
          select: {
            universityId: true,
            university: {
              select: {
                id: true,
                name: true,
                city: true,
              },
            },
            phone: true,
            city: true,
            province: true,
            country: true,
            profilePhotoUrl: true,
            bio: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Student access required." },
        { status: 403 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("GET student profile error:", error);

    return NextResponse.json(
      { error: "Failed to load profile." },
      { status: 500 }
    );
  }
}

/* ============================================================
   PATCH — Update student profile
============================================================ */

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        role: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (existingUser.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Student access required." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const universityId =
      typeof body.universityId === "string"
        ? body.universityId.trim()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    const city =
      typeof body.city === "string"
        ? body.city.trim()
        : "";

    const province =
      typeof body.province === "string"
        ? body.province.trim()
        : "";

    const country =
      typeof body.country === "string"
        ? body.country.trim()
        : "";

    const bio =
      typeof body.bio === "string"
        ? body.bio.trim()
        : "";

    if (!name) {
      return NextResponse.json(
        { error: "Full name is required." },
        { status: 400 }
      );
    }

    /* --------------------------------------------------------
       Validate university if one was selected
    -------------------------------------------------------- */

    if (universityId) {
      const university = await prisma.university.findUnique({
        where: { id: universityId },
        select: { id: true },
      });

      if (!university) {
        return NextResponse.json(
          { error: "Selected university was not found." },
          { status: 400 }
        );
      }
    }

    /* --------------------------------------------------------
       Update User + StudentProfile together
    -------------------------------------------------------- */

    const user = await prisma.user.update({
      where: { id: existingUser.id },

      data: {
        name,

        studentProfile: {
          upsert: {
            create: {
              universityId: universityId || null,
              phone: phone || null,
              city: city || null,
              province: province || null,
              country: country || null,
              bio: bio || null,
            },

            update: {
              universityId: universityId || null,
              phone: phone || null,
              city: city || null,
              province: province || null,
              country: country || null,
              bio: bio || null,
            },
          },
        },
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        verified: true,

        studentProfile: {
          select: {
            universityId: true,
            university: {
              select: {
                id: true,
                name: true,
                city: true,
              },
            },
            phone: true,
            city: true,
            province: true,
            country: true,
            profilePhotoUrl: true,
            bio: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully.",
      user,
    });
  } catch (error) {
    console.error("PATCH student profile error:", error);

    return NextResponse.json(
      { error: "Failed to update profile." },
      { status: 500 }
    );
  }
}