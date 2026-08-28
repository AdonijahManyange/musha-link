import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/* ============================================================
   GET — Current landlord profile
============================================================ */

export async function GET() {
  try {
    const session = await auth();

    /*
     * We use the session email to find the Prisma user.
     * This keeps this route consistent with lib/auth.ts.
     */
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        verified: true,

        landlordProfile: {
          select: {
            phone: true,
            address: true,
            city: true,
            province: true,
            country: true,
            profilePhotoUrl: true,
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

    /*
     * Only landlords should access landlord profile data.
     */
    if (user.role !== "LANDLORD") {
      return NextResponse.json(
        { error: "Landlord access required." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      user,
    });
  } catch (error) {
    console.error(
      "GET landlord profile error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load profile.",
      },
      { status: 500 }
    );
  }
}

/* ============================================================
   PATCH — Update landlord profile
============================================================ */

export async function PATCH(
  request: Request
) {
  try {
    const session = await auth();

    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /*
     * Find the actual Prisma user using the session email.
     */
    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },

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

    /*
     * Make sure this endpoint is only used by landlords.
     */
    if (existingUser.role !== "LANDLORD") {
      return NextResponse.json(
        {
          error: "Landlord access required.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    const address =
      typeof body.address === "string"
        ? body.address.trim()
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
        {
          error: "Full name is required.",
        },
        { status: 400 }
      );
    }

    /*
     * Update the user and landlord profile together.
     *
     * The landlord profile is created automatically
     * if one doesn't exist yet.
     */
    const user = await prisma.user.update({
      where: {
        id: existingUser.id,
      },

      data: {
        name,

        landlordProfile: {
          upsert: {
            create: {
              phone: phone || null,
              address: address || null,
              city: city || null,
              province: province || null,
              country: country || null,
              bio: bio || null,
            },

            update: {
              phone: phone || null,
              address: address || null,
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

        landlordProfile: {
          select: {
            phone: true,
            address: true,
            city: true,
            province: true,
            country: true,
            profilePhotoUrl: true,
            coverPhotoUrl: true,
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
    console.error(
      "PATCH landlord profile error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to update profile.",
      },
      { status: 500 }
    );
  }
}