import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const universities = [
    {
      name: "National University of Science and Technology (NUST)",
      city: "Bulawayo",
      latitude: -20.145,
      longitude: 28.586,
    },
    {
      name: "University of Zimbabwe",
      city: "Harare",
      latitude: -17.784,
      longitude: 31.053,
    },
    {
      name: "Africa University",
      city: "Mutare",
      latitude: -18.893,
      longitude: 32.607,
    },
    {
      name: "Midlands State University",
      city: "Gweru",
      latitude: -19.45,
      longitude: 29.817,
    },
  ];

  for (const university of universities) {
    await prisma.university.upsert({
      where: {
        name: university.name,
      },
      update: university,
      create: university,
    });
  }

  console.log("Universities seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });