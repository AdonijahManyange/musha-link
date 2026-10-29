import "dotenv/config";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function geocodePublicArea(
  suburb: string | null,
  city: string,
  province: string,
  country: string
) {
  // Use general location information only.
  // Never include the property's street address.
  const area = [suburb, city, province, country]
    .filter(Boolean)
    .join(", ");

  const params = new URLSearchParams({
    q: area,
    format: "jsonv2",
    limit: "1",
  });

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      {
        headers: {
          "User-Agent": "MushaLink/1.0 (contact@mushalink.com)",
        },
      }
    );

    if (!response.ok) {
      return { area, coordinates: null, error: `HTTP ${response.status}` };
    }

    const results = await response.json();

    if (!Array.isArray(results) || results.length === 0) {
      return { area, coordinates: null, error: "No location found" };
    }

    const latitude = Number(results[0].lat);
    const longitude = Number(results[0].lon);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return { area, coordinates: null, error: "Invalid coordinates" };
    }

    return {
      area,
      coordinates: { latitude, longitude },
      error: null,
    };
  } catch (error) {
    return {
      area,
      coordinates: null,
      error: error instanceof Error ? error.message : "Geocoding failed",
    };
  }
}

async function main() {
  // Read-only database query: no updates or inserts.
  const listings = await prisma.listing.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { mapLatitude: null },
        { mapLongitude: null },
      ],
    },
    select: {
      title: true,
      suburb: true,
      city: true,
      province: true,
      country: true,
    },
    orderBy: { title: "asc" },
  });

  console.log(`Found ${listings.length} published listings to preview.\n`);

  for (let i = 0; i < listings.length; i++) {
    const listing = listings[i];

    const result = await geocodePublicArea(
      listing.suburb,
      listing.city,
      listing.province,
      listing.country
    );

    console.log({
      title: listing.title,
      searchedArea: result.area,
      proposedLatitude: result.coordinates?.latitude ?? null,
      proposedLongitude: result.coordinates?.longitude ?? null,
      error: result.error,
    });

    // Respect the public geocoding service's usage limit.
    if (i < listings.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1100));
    }
  }
}

main()
  .catch((error) => {
    console.error("Preview failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });