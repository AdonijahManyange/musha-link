import {
  PrismaClient,
  ListingStatus,
  PropertyType,
  RoomType,
  GenderPreference,
  Role,
} from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // ============================================================
  // UNIVERSITIES
  // ============================================================

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

  // ============================================================
  // GET UNIVERSITIES
  // ============================================================

  const africaUniversity =
    await prisma.university.findUniqueOrThrow({
      where: {
        name: "Africa University",
      },
    });

  const universityOfZimbabwe =
    await prisma.university.findUniqueOrThrow({
      where: {
        name: "University of Zimbabwe",
      },
    });

  const nust =
    await prisma.university.findUniqueOrThrow({
      where: {
        name: "National University of Science and Technology (NUST)",
      },
    });

  // ============================================================
  // MOCK LANDLORDS
  // ============================================================

  const landlords = [
    {
      name: "John Doe",
      email: "john@example.com",
      password: null,
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      password: null,
    },
    {
      name: "Alice Johnson",
      email: "alice@example.com",
      password: null,
    },
    {
      name: "Michael Brown",
      email: "michael@example.com",
      password: null,
    },
    {
      name: "Sarah Williams",
      email: "sarah@example.com",
      password: null,
    },
    {
      name: "David Thompson",
      email: "david@example.com",
      password: null,
    },
    {
      name: "Emily Davis",
      email: "emily@example.com",
      password: null,
    },
    {
      name: "Robert Wilson",
      email: "robert@example.com",
      password: null,
    },
  ];

  const landlordRecords: Record<
    string,
    { id: string }
  > = {};

  for (const landlord of landlords) {
    const record = await prisma.user.upsert({
      where: {
        email: landlord.email,
      },
      update: {
        name: landlord.name,
        role: Role.LANDLORD,
        verified: true,
      },
      create: {
        name: landlord.name,
        email: landlord.email,
        password: landlord.password,
        role: Role.LANDLORD,
        verified: true,
      },
    });

    landlordRecords[landlord.email] = {
      id: record.id,
    };
  }

  console.log("Mock landlords seeded successfully.");

  // ============================================================
  // MOCK LISTINGS
  // ============================================================

  const mockListings = [
    {
      slug: "modern-student-room",
      title: "Modern Student Room",
      landlordEmail: "john@example.com",

      address: "Student Accommodation",
      city: "Mutare",
      province: "Manicaland",
      country: "Zimbabwe",

      description:
        "A fully furnished private room located in Fairbridge Park, just minutes from Africa University. The property offers reliable Wi-Fi, solar power, borehole water, and a quiet environment ideal for studying.",

      propertyType: PropertyType.HOUSE,
      roomType: RoomType.PRIVATE,
      genderPreference: GenderPreference.ANY,

      monthlyRent: 180,

      universityId: africaUniversity.id,
      distanceToUniversityKm: 9.1,

      latitude: -18.9675728,
      longitude: 32.643181,

      photos: [
        "/images/listings/room2.png",
        "/images/listings/room2.png",
        "/images/listings/room2.png",
        "/images/listings/room2.png",
        "/images/listings/room2.png",
      ],
    },

    {
      slug: "shared-apartment-chikanga",
      title: "Shared Apartment",
      landlordEmail: "jane@example.com",

      address: "Student Accommodation",
      city: "Mutare",
      province: "Manicaland",
      country: "Zimbabwe",

      description:
        "Affordable shared accommodation in Chikanga with comfortable living spaces and dependable Wi-Fi. Perfect for students looking for a friendly environment close to Africa University.",

      propertyType: PropertyType.APARTMENT,
      roomType: RoomType.SHARED,
      genderPreference: GenderPreference.ANY,

      monthlyRent: 120,

      universityId: africaUniversity.id,
      distanceToUniversityKm: 7.5,

      latitude: null,
      longitude: null,

      photos: [
        "/images/listings/Shared-apartment.jpg",
        "/images/listings/Shared-apartment.jpg",
        "/images/listings/Shared-apartment.jpg",
        "/images/listings/Shared-apartment.jpg",
        "/images/listings/Shared-apartment.jpg",
      ],
    },

    {
      slug: "private-room-near-msuas",
      title: "Private Room",
      landlordEmail: "alice@example.com",

      address: "Student Accommodation",
      city: "Mutare",
      province: "Manicaland",
      country: "Zimbabwe",

      description:
        "A fully furnished private room in Fernhill, conveniently located near MSUAS. Enjoy a peaceful neighborhood, reliable Wi-Fi, and solar power for uninterrupted study sessions.",

      propertyType: PropertyType.HOUSE,
      roomType: RoomType.PRIVATE,
      genderPreference: GenderPreference.ANY,

      monthlyRent: 150,

      universityId: africaUniversity.id,
      distanceToUniversityKm: 6.8,

      latitude: null,
      longitude: null,

      photos: [
        "/images/listings/private-room2.jpg",
        "/images/listings/private-room2.jpg",
        "/images/listings/private-room2.jpg",
        "/images/listings/private-room2.jpg",
        "/images/listings/private-room2.jpg",
      ],
    },

    {
      slug: "student-apartment-uz",
      title: "Student Apartment",
      landlordEmail: "michael@example.com",

      address: "Student Accommodation",
      city: "Harare",
      province: "Harare",
      country: "Zimbabwe",

      description:
        "Spacious student apartment in Avondale, only minutes from the University of Zimbabwe. The property features solar power, borehole water, and high-speed Wi-Fi in a secure and convenient location.",

      propertyType: PropertyType.APARTMENT,
      roomType: RoomType.ENTIRE_PROPERTY,
      genderPreference: GenderPreference.ANY,

      monthlyRent: 220,

      universityId: universityOfZimbabwe.id,
      distanceToUniversityKm: 2.5,

      latitude: null,
      longitude: null,

      photos: [
        "/images/listings/room1.png",
        "/images/listings/room1.png",
        "/images/listings/room1.png",
        "/images/listings/room1.png",
        "/images/listings/room1.png",
      ],
    },

    {
      slug: "budget-shared-room-nust",
      title: "Budget Shared Room",
      landlordEmail: "sarah@example.com",

      address: "Student Accommodation",
      city: "Bulawayo",
      province: "Bulawayo",
      country: "Zimbabwe",

      description:
        "An affordable shared room designed for students who want quality accommodation on a budget. Located in Ascot with reliable Wi-Fi and easy access to NUST campus.",

      propertyType: PropertyType.HOUSE,
      roomType: RoomType.SHARED,
      genderPreference: GenderPreference.ANY,

      monthlyRent: 90,

      universityId: nust.id,
      distanceToUniversityKm: 4.2,

      latitude: null,
      longitude: null,

      photos: [
        "/images/listings/room2.png",
        "/images/listings/room2.png",
        "/images/listings/room2.png",
        "/images/listings/room2.png",
        "/images/listings/room2.png",
      ],
    },

    {
      slug: "modern-flat-africa-university",
      title: "Modern Flat",
      landlordEmail: "david@example.com",

      address: "Student Accommodation",
      city: "Mutare",
      province: "Manicaland",
      country: "Zimbabwe",

      description:
        "A modern flat in Murambi offering spacious rooms and excellent amenities for student living. Includes solar backup, borehole water, and high-speed internet in a safe neighborhood.",

      propertyType: PropertyType.FLAT,
      roomType: RoomType.SHARED,
      genderPreference: GenderPreference.ANY,

      monthlyRent: 200,

      universityId: africaUniversity.id,
      distanceToUniversityKm: 5.4,

      latitude: null,
      longitude: null,

      photos: [
        "/images/listings/Modern-flat.png",
        "/images/listings/Modern-flat.png",
        "/images/listings/Modern-flat.png",
        "/images/listings/Modern-flat.png",
        "/images/listings/Modern-flat.png",
      ],
    },

    {
      slug: "shared-apartment-uz",
      title: "Shared Apartment",
      landlordEmail: "emily@example.com",

      address: "Student Accommodation",
      city: "Harare",
      province: "Harare",
      country: "Zimbabwe",

      description:
        "Comfortable shared apartment in Mt Pleasant, one of Harare's most sought-after student neighborhoods. Enjoy spacious rooms, reliable utilities, and convenient access to the University of Zimbabwe.",

      propertyType: PropertyType.APARTMENT,
      roomType: RoomType.SHARED,
      genderPreference: GenderPreference.ANY,

      monthlyRent: 230,

      universityId: universityOfZimbabwe.id,
      distanceToUniversityKm: 3.1,

      latitude: null,
      longitude: null,

      photos: [
        "/images/listings/room3.png",
        "/images/listings/room3.png",
        "/images/listings/room3.png",
        "/images/listings/room3.png",
        "/images/listings/room3.png",
      ],
    },

    {
      slug: "private-room-africa-university",
      title: "Private Room",
      landlordEmail: "robert@example.com",

      address: "Student Accommodation",
      city: "Mutare",
      province: "Manicaland",
      country: "Zimbabwe",

      description:
        "A comfortable private room in Fairbridge Park, ideal for students seeking privacy and a quiet place to study. The property includes Wi-Fi, solar backup, and borehole water for everyday convenience.",

      propertyType: PropertyType.HOUSE,
      roomType: RoomType.PRIVATE,
      genderPreference: GenderPreference.ANY,

      monthlyRent: 170,

      universityId: africaUniversity.id,
      distanceToUniversityKm: 9.0,

      latitude: null,
      longitude: null,

      photos: [
        "/images/listings/private-room.jpg",
        "/images/listings/private-room2.jpg",
        "/images/listings/private-room3.jpg",
        "/images/listings/private-room4.jpg",
        "/images/listings/private-room5.jpg",
      ],
    },
  ];

  // ============================================================
  // CREATE MOCK LISTINGS
  // ============================================================

  for (const mock of mockListings) {
    const landlord = landlordRecords[mock.landlordEmail];

    if (!landlord) {
      throw new Error(
        `Landlord not found: ${mock.landlordEmail}`
      );
    }

    // Find an existing seeded listing.
    const existingListing =
      await prisma.listing.findFirst({
        where: {
          title: mock.title,
          landlordId: landlord.id,
        },
      });

    let listing;

    if (existingListing) {
      listing =
        await prisma.listing.update({
          where: {
            id: existingListing.id,
          },
          data: {
            title: mock.title,
            address: mock.address,
            city: mock.city,
            province: mock.province,
            country: mock.country,
            description: mock.description,
            propertyType: mock.propertyType,
            latitude: mock.latitude,
            longitude: mock.longitude,
            universityId: mock.universityId,
            distanceToUniversityKm:
              mock.distanceToUniversityKm,
            monthlyRent: mock.monthlyRent,
            roomType: mock.roomType,
            genderPreference:
              mock.genderPreference,
            status: ListingStatus.PUBLISHED,
            isActive: true,
          },
        });

      // Refresh photos for this mock listing only.
      await prisma.listingPhoto.deleteMany({
        where: {
          listingId: listing.id,
        },
      });
    } else {
      listing =
        await prisma.listing.create({
          data: {
            landlordId: landlord.id,

            title: mock.title,
            address: mock.address,
            city: mock.city,
            province: mock.province,
            country: mock.country,
            description: mock.description,

            propertyType: mock.propertyType,

            latitude: mock.latitude,
            longitude: mock.longitude,

            universityId: mock.universityId,

            distanceToUniversityKm:
              mock.distanceToUniversityKm,

            monthlyRent: mock.monthlyRent,

            roomType: mock.roomType,
            genderPreference:
              mock.genderPreference,

            status: ListingStatus.PUBLISHED,
            isActive: true,
          },
        });
    }

    // ==========================================================
    // PHOTOS
    // ==========================================================

    await prisma.listingPhoto.createMany({
      data: mock.photos.map(
        (url, index) => ({
          listingId: listing.id,
          url,
          fileName: url.split("/").pop() || `photo-${index + 1}`,
          sortOrder: index,
          isCover: index === 0,
        })
      ),
    });

    console.log(
      `Seeded listing: ${mock.title}`
    );
  }

  console.log(
    "Mock listings seeded successfully."
  );

  console.log(
    "Your real landlord-created listings were not deleted or modified."
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });