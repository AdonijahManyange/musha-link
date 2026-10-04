import { prisma } from "./lib/prisma";

async function main() {
  const result = await prisma.$queryRaw`
    SELECT
      COUNT(*) AS total_listings,
      COUNT(*) FILTER (WHERE title IS NULL) AS null_titles,
      COUNT(*) FILTER (WHERE address IS NULL) AS null_addresses,
      COUNT(*) FILTER (WHERE description IS NULL) AS null_descriptions,
      COUNT(*) FILTER (WHERE "universityId" IS NULL) AS null_universities,
      COUNT(*) FILTER (WHERE "monthlyRent" IS NULL) AS null_rents,
      COUNT(*) FILTER (WHERE "roomType" IS NULL) AS null_room_types,
      COUNT(*) FILTER (WHERE "genderPreference" IS NULL) AS null_gender_preferences
    FROM "Listing";
  `;

  console.log(result);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());