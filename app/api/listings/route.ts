import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  Amenity,
  BathroomFeature,
  BathroomLocation,
  GenderPreference,
  InternetProvider,
  PropertyType,
  RoomType,
  SolarBackupCapacity,
  WaterSource,
} from "@/generated/prisma";
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
  const queries = [
    [address, city, province, country],
    [address, suburb, city, province, country],
    [suburb, city, province, country],
  ];

  for (const parts of queries) {
    const query = parts.filter(Boolean).join(", ");

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

    if (!Array.isArray(results) || results.length === 0) {
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

  const dLatitude = toRadians(latitude2 - latitude1);
  const dLongitude = toRadians(longitude2 - longitude1);

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
// REQUIRED PHOTO CATEGORIES
// ============================================================

const requiredPhotoCategories = {
  LIVING_ROOM: 2,
  BEDROOM: 2,
  BATHROOM: 2,
  FRONT_YARD: 1,
  PARKING: 1,
  MAIN_ENTRANCE: 1,
  VERANDA: 1,
} as const;

// ============================================================
// ENUM HELPERS
// ============================================================

function parsePropertyType(
  value: unknown
): PropertyType | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  return Object.values(PropertyType).includes(
    value as PropertyType
  )
    ? (value as PropertyType)
    : undefined;
}

function parseRoomType(
  value: unknown
): RoomType | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  return Object.values(RoomType).includes(
    value as RoomType
  )
    ? (value as RoomType)
    : undefined;
}

function parseGenderPreference(
  value: unknown
): GenderPreference | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  return Object.values(GenderPreference).includes(
    value as GenderPreference
  )
    ? (value as GenderPreference)
    : undefined;
}

function parseInternetProvider(
  value: unknown
): InternetProvider | null {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  return Object.values(InternetProvider).includes(
    value as InternetProvider
  )
    ? (value as InternetProvider)
    : null;
}

function parseWaterSource(
  value: unknown
): WaterSource | null {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  return Object.values(WaterSource).includes(
    value as WaterSource
  )
    ? (value as WaterSource)
    : null;
}

function parseSolarBackupCapacity(
  value: unknown
): SolarBackupCapacity | null {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  return Object.values(
    SolarBackupCapacity
  ).includes(
    value as SolarBackupCapacity
  )
    ? (value as SolarBackupCapacity)
    : null;
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

        select: {
          id: true,
          createdAt: true,
          updatedAt: true,

          title: true,

          // Public location only.
          suburb: true,
          city: true,
          province: true,
          country: true,

          description: true,

          // Exact coordinates remain private.
          latitude: false,
          longitude: false,

          distanceToUniversityKm: true,

          monthlyRent: true,
          roomType: true,
          genderPreference: true,
          propertyType: true,

          depositRequired: true,
          depositAmount: true,
          additionalFees: true,

          utilitiesIncluded: true,
          internetCharges: true,

          internetProvider: true,
          waterSource: true,
          waterDrinkable: true,
          solarBackupCapacity: true,

          isActive: true,
          status: true,

          amenities: true,

          university: true,

          photos: {
            orderBy: {
              sortOrder: "asc",
            },
          },

          bathrooms: {
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

        select: {
          id: true,
          createdAt: true,
          updatedAt: true,

          title: true,

          suburb: true,
          city: true,
          province: true,
          country: true,

          description: true,

          latitude: false,
          longitude: false,

          distanceToUniversityKm: true,

          monthlyRent: true,
          roomType: true,
          genderPreference: true,
          propertyType: true,

          depositRequired: true,
          depositAmount: true,
          additionalFees: true,

          utilitiesIncluded: true,
          internetCharges: true,

          internetProvider: true,
          waterSource: true,
          waterDrinkable: true,
          solarBackupCapacity: true,

          isActive: true,
          status: true,

          amenities: true,

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

          bathrooms: {
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

          bathrooms: {
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

        bathrooms: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    // ==========================================================
    // ADD PUBLISH STATUS
    // ==========================================================

    const listingsWithPublishStatus =
      listings.map((listing) => {
        const missingPhotoCategories =
          Object.entries(requiredPhotoCategories)
            .filter(([category, requiredCount]) => {
              const uploadedCount =
                listing.photos.filter(
                  (photo) =>
                    photo.category === category
                ).length;

              return uploadedCount < requiredCount;
            })
            .map(([category, requiredCount]) => ({
              category,
              required: requiredCount,
              uploaded:
                listing.photos.filter(
                  (photo) =>
                    photo.category === category
                ).length,
            }));

        return {
          ...listing,

          canPublish:
            missingPhotoCategories.length === 0,

          missingPhotoCategories,
        };
      });

    return NextResponse.json(
      listingsWithPublishStatus
    );
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
            "Only landlords can create listings.",
        },
        {
          status: 403,
        }
      );
    }

    // ==========================================================
    // LANDLORD VERIFICATION
    // ==========================================================

    const verification =
      await prisma.landlordVerification.findUnique({
        where: {
          landlordId: user.id,
        },
      });

    if (
      !verification ||
      verification.status !== "APPROVED"
    ) {
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

    // ==========================================================
    // READ BODY
    // ==========================================================

    const body = await request.json();

    // ==========================================================
    // LISTING DATA
    // ==========================================================

    const {
      saveAsDraft,
      title,
      propertyType,
      address,
      suburb,
      city,
      province,
      country,
      monthlyRent,
      depositRequired,
      depositAmount,
      additionalFees,
      utilitiesIncluded,
      internetCharges,
      internetProvider,
      waterSource,
      waterDrinkable,
      solarBackupCapacity,
      roomType,
      genderPreference,
      universityId,
      description,
    } = body;

    const isDraftSave =
      saveAsDraft === true;

    // ==========================================================
    // CLEAN ADDRESS VALUES
    // ==========================================================

    const cleanAddress =
      typeof address === "string"
        ? address.trim()
        : "";

    const cleanSuburb =
      typeof suburb === "string"
        ? suburb.trim()
        : "";

    const cleanCity =
      typeof city === "string"
        ? city.trim()
        : "";

    const cleanProvince =
      typeof province === "string"
        ? province.trim()
        : "";

    const cleanCountry =
      typeof country === "string"
        ? country.trim()
        : "";

    // ==========================================================
    // ADDRESS VALIDATION
    // ==========================================================

    if (
      !cleanAddress ||
      !cleanSuburb ||
      !cleanCity ||
      !cleanProvince ||
      !cleanCountry
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

    // ==========================================================
    // UNIVERSITY VALIDATION
    // ==========================================================

    if (
      typeof universityId !== "string" ||
      !universityId.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Please select a university.",
        },
        {
          status: 400,
        }
      );
    }

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

    // ==========================================================
    // GEOCODING
    // ==========================================================

    const coordinates =
      await geocodeAddress(
        cleanAddress,
        cleanSuburb,
        cleanCity,
        cleanProvince,
        cleanCountry
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

    // ==========================================================
    // DISTANCE TO UNIVERSITY
    // ==========================================================

    const distanceToUniversityKm =
      calculateDistanceKm(
        coordinates.latitude,
        coordinates.longitude,
        university.latitude,
        university.longitude
      );

    // ==========================================================
    // NORMALIZE LISTING VALUES
    // ==========================================================

    const cleanTitle =
      typeof title === "string"
        ? title.trim()
        : "";

    const cleanDescription =
      typeof description === "string"
        ? description.trim()
        : "";

    const parsedPropertyType =
      parsePropertyType(propertyType);

    const parsedRoomType =
      parseRoomType(roomType);

    const parsedGenderPreference =
      parseGenderPreference(
        genderPreference
      );

    const parsedInternetProvider =
      parseInternetProvider(
        internetProvider
      );

    const parsedWaterSource =
      parseWaterSource(waterSource);

    const parsedSolarBackupCapacity =
      parseSolarBackupCapacity(
        solarBackupCapacity
      );

    // ==========================================================
    // REQUIRED LISTING FIELDS
    // ==========================================================

    if (!cleanTitle) {
      return NextResponse.json(
        {
          error: "Listing title is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!parsedRoomType) {
      return NextResponse.json(
        {
          error: "Please select a room type.",
        },
        {
          status: 400,
        }
      );
    }

    if (!parsedGenderPreference) {
      return NextResponse.json(
        {
          error:
            "Please select a gender preference.",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================================
    // MONTHLY RENT
    // ==========================================================

    const normalizedMonthlyRent =
      Number(monthlyRent);

    if (
      !Number.isFinite(
        normalizedMonthlyRent
      ) ||
      normalizedMonthlyRent < 0
    ) {
      return NextResponse.json(
        {
          error:
            "Monthly rent must be a valid amount.",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================================
    // DEPOSIT
    // ==========================================================

    const hasDeposit =
      depositRequired === true;

    const normalizedDepositAmount =
      hasDeposit &&
      depositAmount !== null &&
      depositAmount !== undefined &&
      depositAmount !== ""
        ? Number(depositAmount)
        : null;

    if (
      normalizedDepositAmount !== null &&
      (!Number.isFinite(
        normalizedDepositAmount
      ) ||
        normalizedDepositAmount < 0)
    ) {
      return NextResponse.json(
        {
          error:
            "Security deposit must be a valid amount.",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================================
    // AMENITIES
    // ==========================================================

    const amenities =
      Array.isArray(body.amenities)
        ? body.amenities.filter(
            (
              amenity: unknown
            ): amenity is Amenity =>
              typeof amenity === "string" &&
              Object.values(Amenity).includes(
                amenity as Amenity
              )
          )
        : [];

    // ==========================================================
    // BATHROOMS
    // ==========================================================

    type IncomingBathroom = {
      location?: unknown;
      features?: unknown;
    };

    const incomingBathrooms =
      Array.isArray(body.bathrooms)
        ? (body.bathrooms as IncomingBathroom[])
        : [];

    const bathrooms =
      incomingBathrooms
        .map((bathroom) => {
          const location =
            typeof bathroom.location === "string"
              ? bathroom.location
              : "INSIDE";

          if (
            !Object.values(
              BathroomLocation
            ).includes(
              location as BathroomLocation
            )
          ) {
            return null;
          }

          const features =
            Array.isArray(
              bathroom.features
            )
              ? bathroom.features.filter(
                  (
                    feature: unknown
                  ): feature is BathroomFeature =>
                    typeof feature === "string" &&
                    Object.values(
                      BathroomFeature
                    ).includes(
                      feature as BathroomFeature
                    )
                )
              : [];

          if (features.length === 0) {
            return null;
          }

          return {
            location:
              location as BathroomLocation,

            features: {
              set: features,
            },
          };
        })
        .filter(
          (
            bathroom
          ): bathroom is {
            location: BathroomLocation;
            features: {
              set: BathroomFeature[];
            };
          } => bathroom !== null
        );

    // ==========================================================
    // CREATE LISTING
    // ==========================================================

    const listing =
      await prisma.listing.create({
        data: {
          // ----------------------------------------------------
          // LANDLORD
          // ----------------------------------------------------

          landlord: {
            connect: {
              id: user.id,
            },
          },

          // ----------------------------------------------------
          // BASIC INFORMATION
          // ----------------------------------------------------

          title: cleanTitle,

          address: cleanAddress,

          suburb: cleanSuburb,

          city: cleanCity,

          province: cleanProvince,

          country: cleanCountry,

          description: cleanDescription,

          ...(parsedPropertyType
            ? {
                propertyType:
                  parsedPropertyType,
              }
            : {}),

          // ----------------------------------------------------
          // UNIVERSITY
          // ----------------------------------------------------

          university: {
            connect: {
              id: universityId,
            },
          },

          // ----------------------------------------------------
          // PRICING
          // ----------------------------------------------------

          monthlyRent:
            normalizedMonthlyRent,

          depositRequired:
            hasDeposit,

          depositAmount:
            normalizedDepositAmount,

          additionalFees:
            typeof additionalFees === "string"
              ? additionalFees.trim() || null
              : null,

          // ----------------------------------------------------
          // UTILITIES
          // ----------------------------------------------------

          utilitiesIncluded:
            typeof utilitiesIncluded === "string"
              ? utilitiesIncluded.trim() || null
              : null,

          internetCharges:
            typeof internetCharges === "string"
              ? internetCharges.trim() || null
              : null,

          internetProvider:
            parsedInternetProvider,

          waterSource:
            parsedWaterSource,

          waterDrinkable:
            waterDrinkable === true
              ? true
              : waterDrinkable === false
                ? false
                : null,

          solarBackupCapacity:
            parsedSolarBackupCapacity,

          // ----------------------------------------------------
          // ROOM INFORMATION
          // ----------------------------------------------------

          roomType:
            parsedRoomType,

          genderPreference:
            parsedGenderPreference,

          // ----------------------------------------------------
          // STATUS
          // ----------------------------------------------------

          status: "DRAFT",

          isActive: true,

          // ----------------------------------------------------
          // LOCATION
          // ----------------------------------------------------

          latitude:
            coordinates.latitude,

          longitude:
            coordinates.longitude,

          distanceToUniversityKm,

          // ----------------------------------------------------
          // AMENITIES
          // ----------------------------------------------------

          amenities,

          // ----------------------------------------------------
          // BATHROOMS
          // ----------------------------------------------------

          bathrooms: {
            create: bathrooms.map(
              (bathroom, index) => ({
                sortOrder: index,

                location:
                  bathroom.location,

                features:
                  bathroom.features,
              })
            ),
          },
        },

        include: {
          university: true,

          photos: {
            orderBy: {
              sortOrder: "asc",
            },
          },

          bathrooms: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      });

    // ==========================================================
    // RESPONSE
    // ==========================================================

    return NextResponse.json(
      {
        ...listing,

        savedAsDraft: isDraftSave,
      },
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