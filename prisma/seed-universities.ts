import "dotenv/config";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

const universities = [
  {
    name: "University of Zimbabwe",
    city: "Harare",
    logo: "/images/universities/uz.png",
    latitude: -17.784,
    longitude: 31.053,
  },
  {
    name: "National University of Science and Technology",
    city: "Bulawayo",
    logo: "/images/universities/nust.png",
    latitude: -20.145,
    longitude: 28.587,
  },
  {
    name: "Africa University",
    city: "Mutare",
    logo: "/images/universities/africa-university.jpeg",
    latitude: -18.893,
    longitude: 32.611,
  },
  {
    name: "Midlands State University",
    city: "Gweru",
    logo: "/images/universities/msu.png",
    latitude: -19.455,
    longitude: 29.817,
  },
  {
    name: "Zimbabwe Open University",
    city: "Harare",
    logo: "/images/universities/zimbabwe-open-university.png",
    latitude: -17.829,
    longitude: 31.052,
  },
  {
    name: "Women's University in Africa",
    city: "Harare",
    logo: "/images/universities/womens-university-in-africa.jpg",
    latitude: -17.827,
    longitude: 31.053,
  },
  {
    name: "Great Zimbabwe University",
    city: "Masvingo",
    logo: "/images/universities/great-zimbabwe-university.png",
    latitude: -20.073,
    longitude: 30.835,
  },
  {
    name: "Gwanda State University",
    city: "Gwanda",
    logo: "/images/universities/gwanda-state-university.png",
    latitude: -20.938,
    longitude: 29.006,
  },
  {
    name: "Marondera University of Agricultural Sciences and Technology",
    city: "Marondera",
    logo: "/images/universities/muast.png",
    latitude: -18.185,
    longitude: 31.552,
  },
  {
    name: "Zimbabwe Ezekiel Guti University",
    city: "Bindura",
    logo: "/images/universities/zimbabwe-ezekiel-guti-university.jpg",
    latitude: -17.301,
    longitude: 31.330,
  },
  {
    name: "Solusi University",
    city: "Bulawayo",
    logo: "/images/universities/solusi-university.jpg",
    latitude: -20.293,
    longitude: 28.730,
  },
  {
    name: "Bindura University of Science Education",
    city: "Bindura",
    logo: "/images/universities/buse-logo.png",
    latitude: -17.301,
    longitude: 31.330,
  },
];

async function main() {
  console.log("Seeding universities...");

  for (const university of universities) {
    const result = await prisma.university.upsert({
      where: {
        name: university.name,
      },
      update: {
        city: university.city,
        logo: university.logo,
        latitude: university.latitude,
        longitude: university.longitude,
      },
      create: university,
    });

    console.log(`✓ ${result.name}`);
  }

  console.log(
    `\nSuccessfully seeded ${universities.length} universities.`
  );
}

main()
  .catch((error) => {
    console.error("Failed to seed universities:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });