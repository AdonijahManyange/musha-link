import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// ============================================================
// GET — Listings
//
// Public:
//   GET /api/listings?status=PUBLISHED
//
// Landlord:
//   GET /api/listings
//      → DRAFT + PUBLISHED listings
//
//   GET /api/listings?status=ARCHIVED
//      → ARCHIVED listings only
//
// ============================================================

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");

    // ==========================================================
    // PUBLIC PUBLISHED LISTINGS
    // ==========================================================

    if (status === "PUBLISHED") {
      const listings =
        await prisma.listing.findMany({
          where: {
            status: "PUBLISHED",
            isActive: true,
          },

          include: {
            university: true,

            photos: {
              orderBy: {
                sortOrder: "asc",
              },
            },
          },

          orderBy: {
            createdAt: "desc",
          },
        });

      return NextResponse.json(listings);
    }

    // ==========================================================
    // AUTHENTICATION
    // ==========================================================

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "You must be logged in.",
        },
        {
          status: 401,
        }
      );
    }

    // ==========================================================
    // LANDLORD CHECK
    // ==========================================================

    if (user.role !== "LANDLORD") {
      return NextResponse.json(
        {
          error:
            "Only landlords can access their listings.",
        },
        {
          status: 403,
        }
      );
    }

    // ==========================================================
    // LANDLORD ARCHIVES
    // ==========================================================

    if (status === "ARCHIVED") {
      const listings =
        await prisma.listing.findMany({
          where: {
            landlordId: user.id,
            status: "ARCHIVED",
          },

          include: {
            university: true,

            photos: {
              orderBy: {
                sortOrder: "asc",
              },
            },
          },

          orderBy: {
            createdAt: "desc",
          },
        });

      return NextResponse.json(listings);
    }

    // ==========================================================
    // LANDLORD ACTIVE LISTINGS
    //
    // Only DRAFT and PUBLISHED listings appear in
    // "My Listings".
    //
    // Archived listings are intentionally excluded.
    // ==========================================================

    const listings =
      await prisma.listing.findMany({
        where: {
          landlordId: user.id,

          status: {
            in: ["DRAFT", "PUBLISHED"],
          },
        },

        include: {
          university: true,

          photos: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(listings);
  } catch (error) {
    console.error(
      "Failed to load listings:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while loading listings.",
      },
      {
        status: 500,
      }
    );
  }
}

// ============================================================
// POST — Create Listing
// ============================================================

export async function POST(request: Request) {
  try {
    // ----------------------------------------------------------
    // Authentication
    // ----------------------------------------------------------

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "You must be logged in.",
        },
        {
          status: 401,
        }
      );
    }

    // ----------------------------------------------------------
    // Landlord check
    // ----------------------------------------------------------

    if (user.role !== "LANDLORD") {
      return NextResponse.json(
        {
          error:
            "Only landlords can create listings.",
        },
        {
          status: 403,
        }
      );
    }

    // ----------------------------------------------------------
    // Read request body
    // ----------------------------------------------------------

    const body = await request.json();

    // ----------------------------------------------------------
    // Create listing
    // ----------------------------------------------------------

    const listing =
      await prisma.listing.create({
        data: {
          landlordId: user.id,

          title: body.title,
          address: body.address,
          city: body.city,
          province: body.province,
          country: body.country,

          description:
            body.description,

          propertyType:
            body.propertyType,

          latitude:
            body.latitude ?? null,

          longitude:
            body.longitude ?? null,

          universityId:
            body.universityId,

          distanceToUniversityKm:
            body.distanceToUniversityKm ??
            null,

          monthlyRent:
            Number(body.monthlyRent),

          roomType:
            body.roomType,

          genderPreference:
            body.genderPreference,

          status: "DRAFT",

          isActive: true,
        },

        include: {
          university: true,

          photos: true,
        },
      });

    return NextResponse.json(
      listing,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Failed to create listing:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while creating the listing.",
      },
      {
        status: 500,
      }
    );
  }
}