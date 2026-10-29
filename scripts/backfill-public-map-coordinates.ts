import "dotenv/config";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

const publicCoordinates = [
  {
    title: "Axel Homes",
    suburb: "Chikanga 1",
    city: "Mutare",
    latitude: -18.9667699,
    longitude: 32.6364802,
  },
  {
    title: "Budget Shared Room",
    city: "Bulawayo",
    latitude: -20.1560599,
    longitude: 28.5887063,
  },
  {
    title: "Modern Flat",
    city: "Mutare",
    latitude: -18.974656,
    longitude: 32.670473,
  },
  {
    title: "Modern Student Room",
    city: "Mutare",
    latitude: -18.974656,
    longitude: 32.670473,
  },
  {
    title: "Private Room",
    city: "Mutare",
    latitude: -18.974656,
    longitude: 32.670473,
  },
  {
    title: "Shared Apartment",
    city: "Harare",
    latitude: -17.831773,
    longitude: 31.045686,
  },
  {
    title: "Student Apartment",
    city: "Harare",
    latitude: -17.831773,
    longitude: 31.045686,
  },
];

async function main() {
  // Preview the exact records that will be updated.
  const listings = await prisma.listing.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { mapLatitude: null },
        { mapLongitude: null },
      ],
    },
    select: {
      id: true,
      title: true,
      suburb: true,
      city: true,
    },
  });

  console.log(`Found ${listings.length} published listings needing coordinates.`);

  let updated = 0;
  let skipped = 0;

  for (const listing of listings) {
    const match = publicCoordinates.find(
      (coordinate) =>
        coordinate.title === listing.title &&
        coordinate.city.toLowerCase() === listing.city.toLowerCase() &&
        (!coordinate.suburb ||
          coordinate.suburb.toLowerCase() === listing.suburb?.toLowerCase())
    );

    if (!match) {
      console.warn(`Skipped "${listing.title}": no unambiguous coordinate match.`);
      skipped++;
      continue;
    }

    // Update only the public map-coordinate fields.
    await prisma.listing.update({
      where: { id: listing.id },
      data: {
        mapLatitude: match.latitude,
        mapLongitude: match.longitude,
      },
    });

    console.log(`Updated public coordinates for "${listing.title}".`);
    updated++;
  }

  console.log(`\nFinished. Updated: ${updated}; skipped: ${skipped}.`);
}

main()
  .catch((error) => {
    console.error("Backfill failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });