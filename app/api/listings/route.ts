import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Amenity } from "@/generated/prisma";
import { getCurrentUser } from "@/lib/auth";

// ============================================================
// GEOCODING
// ============================================================

async function geocodeAddress(
  address: string,
  suburb: string,
  city: string,
  province: string,
  country: string
) {
  // Try the original address format first.
  // This preserves the geocoding behavior that was
  // already working before suburb was added.
  const queries = [
    [address, city, province, country],
    [address, suburb, city, province, country],
    [suburb, city, province, country],
  ];

  for (const parts of queries) {
    const query = parts
      .filter(Boolean)
      .join(", ");

    const params = new URLSearchParams({
      q: query,
      format: "jsonv2",
      limit: "1",
      addressdetails: "1",
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      {
        headers: {
          "User-Agent":
            "MushaLink/1.0 (contact@mushalink.com)",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(
        "Unable to contact the address mapping service."
      );
    }

    const results = await response.json();

    if (
      !Array.isArray(results) ||
      results.length === 0
    ) {
      continue;
    }

    const latitude = Number(results[0].lat);
    const longitude = Number(results[0].lon);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      continue;
    }

    return {
      latitude,
      longitude,
      displayName: results[0].display_name,
    };
  }

  return null;
}

// ============================================================
// DISTANCE CALCULATOR
// ============================================================

function calculateDistanceKm(
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number
) {
  const earthRadiusKm = 6371;

  const toRadians = (degrees: number) =>
    (degrees * Math.PI) / 180;

  const dLatitude = toRadians(
    latitude2 - latitude1
  );

  const dLongitude = toRadians(
    longitude2 - longitude1
  );

  const lat1 = toRadians(latitude1);
  const lat2 = toRadians(latitude2);

  const a =
    Math.sin(dLatitude / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLongitude / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadiusKm * c;
}


// ============================================================
// GET — Listings
// ============================================================

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");
    const universityId = searchParams.get("university");
    const ids = searchParams.get("ids");

    // ==========================================================
    // PUBLIC PUBLISHED LISTINGS
    // ==========================================================

    if (status === "PUBLISHED") {
      const listings = await prisma.listing.findMany({
        where: {
          status: "PUBLISHED",
          isActive: true,

          ...(universityId
            ? {
                universityId,
              }
            : {}),
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
    // SAVED LISTINGS
    // ==========================================================

    if (ids) {
      const listingIds = ids
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);

      const listings = await prisma.listing.findMany({
        where: {
          id: {
            in: listingIds,
          },
          status: "PUBLISHED",
          isActive: true,
        },

        include: {
          university: true,

          landlord: {
            select: {
              name: true,
              email: true,
              landlordProfile: {
                select: {
                  phone: true,
                },
              },
            },
          },

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
    // LANDLORD ARCHIVED LISTINGS
    // ==========================================================

    if (status === "ARCHIVED") {
      const listings = await prisma.listing.findMany({
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
    // ==========================================================

    const listings = await prisma.listing.findMany({
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
    console.error("Failed to load listings:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while loading listings.",
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
          error: "Only landlords can create listings.",
        },
        {
          status: 403,
        }
      );
    }

    // ----------------------------------------------------------
    // Landlord verification check
    // ----------------------------------------------------------

    const verification =
      await prisma.landlordVerification.findUnique({
        where: {
          landlordId: user.id,
        },
      });

    if (!verification || verification.status !== "APPROVED") {
      return NextResponse.json(
        {
          error:
            "Your landlord account must be verified before you can create a listing.",
          code: "VERIFICATION_REQUIRED",
          verificationStatus:
            verification?.status ?? "NOT_STARTED",
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
    // Address & Listing Data
    // ----------------------------------------------------------

    const {
      title,
      address,
      suburb,
      city,
      province,
      country,
      description,
      propertyType,
      universityId,
      monthlyRent,
      roomType,
      genderPreference,
    } = body;

    // ----------------------------------------------------------
    // Validate Address
    // ----------------------------------------------------------

    if (
      !address ||
      !suburb ||
      !city ||
      !province ||
      !country
    ) {
      return NextResponse.json(
        {
          error:
            "Complete property address is required.",
        },
        {
          status: 400,
        }
      );
    }
    
    // ----------------------------------------------------------
    // Find University
    // ----------------------------------------------------------

    const university =
      await prisma.university.findUnique({
        where: {
          id: universityId,
        },
      });

    if (!university) {
      return NextResponse.json(
        {
          error:
            "Selected university could not be found.",
        },
        {
          status: 400,
        }
      );
    }

    // ----------------------------------------------------------
    // Geocode Property Address
    // ----------------------------------------------------------

    const coordinates = await geocodeAddress(
      address,
      suburb,
      city,
      province,
      country
    );

    if (!coordinates) {
      return NextResponse.json(
        {
          error:
            "We couldn't locate this property address. Please check the street, suburb, city, and province and try again.",
        },
        {
          status: 400,
        }
      );
    }

    // ----------------------------------------------------------
    // Calculate Distance to University
    // ----------------------------------------------------------

    const distanceToUniversityKm =
      calculateDistanceKm(
        coordinates.latitude,
        coordinates.longitude,
        university.latitude,
        university.longitude
      );

    // ----------------------------------------------------------
    // Amenities
    // ----------------------------------------------------------

    const amenities = Array.isArray(body.amenities)
      ? body.amenities.filter(
          (amenity: unknown): amenity is Amenity =>
            typeof amenity === "string" &&
            Object.values(Amenity).includes(amenity as Amenity)
        )
      : [];

    // ----------------------------------------------------------
    // Create listing
    // ----------------------------------------------------------

    const listing = await prisma.listing.create({
      data: {
        landlordId: user.id,
        title,
        address,
        suburb,
        city,
        province,
        country,
        description,
        propertyType,
        universityId,
        monthlyRent: Number(monthlyRent),
        roomType,
        genderPreference,
        status: "DRAFT",
        isActive: true,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        distanceToUniversityKm,
        amenities,
      },

      include: {
        university: true,

        photos: true,
      },
    });

    return NextResponse.json(listing, {
      status: 201,
    });
  } catch (error) {
    console.error("Failed to create listing:", error);

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