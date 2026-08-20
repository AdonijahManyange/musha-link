import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  geocodeAddress,
  calculateDistanceKm,
} from "@/lib/geocoding";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    if (user.role !== "LANDLORD") {
      return NextResponse.json(
        { error: "Only landlords can view listings." },
        { status: 403 }
      );
    }

    const listings = await prisma.listing.findMany({
      where: {
        landlordId: user.id,
        status: {
          not: "ARCHIVED",
        },
      },
      include: {
        university: {
          select: {
            name: true,
            city: true,
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
  } catch (error) {
    console.error(
      "Failed to fetch listings:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while loading listings.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    if (user.role !== "LANDLORD") {
      return NextResponse.json(
        {
          error:
            "Only landlords can create listings.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const {
      title,
      address,
      city,
      province,
      country,
      universityId,
      monthlyRent,
      propertyType,
      roomType,
      genderPreference,
      description,
    } = body;

    if (
      !title ||
      !address ||
      !city ||
      !province ||
      !country ||
      !universityId ||
      !monthlyRent ||
      !propertyType ||
      !roomType ||
      !genderPreference ||
      !description
    ) {
      return NextResponse.json(
        {
          error:
            "Please complete all required fields.",
        },
        { status: 400 }
      );
    }

    const validPropertyTypes = [
      "HOUSE",
      "FLAT",
      "APARTMENT",
      "TOWNHOUSE",
      "COTTAGE",
      "ROOMING_HOUSE",
      "OTHER",
    ];

    const validRoomTypes = [
      "PRIVATE",
      "SHARED",
      "ENTIRE_PROPERTY",
    ];

    const validGenderPreferences = [
      "ANY",
      "MALE",
      "FEMALE",
    ];

    if (
      !validPropertyTypes.includes(
        propertyType
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid property type.",
        },
        { status: 400 }
      );
    }

    if (
      !validRoomTypes.includes(roomType)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid room type.",
        },
        { status: 400 }
      );
    }

    if (
      !validGenderPreferences.includes(
        genderPreference
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid gender preference.",
        },
        { status: 400 }
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
        { status: 400 }
      );
    }

    const rentAmount =
      Number(monthlyRent);

    if (
      !Number.isInteger(rentAmount) ||
      rentAmount <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Monthly rent must be a valid positive number.",
        },
        { status: 400 }
      );
    }

    const fullAddress =
      `${address}, ${city}, ${province}, ${country}`;

    const coordinates =
      await geocodeAddress(fullAddress);

    if (!coordinates) {
      return NextResponse.json(
        {
          error:
            "We couldn't find that property address. Please check the address and try again.",
        },
        { status: 400 }
      );
    }

    const distanceKm =
      calculateDistanceKm(
        coordinates.latitude,
        coordinates.longitude,
        university.latitude,
        university.longitude
      );

    const listing =
      await prisma.listing.create({
        data: {
          landlordId: user.id,

          title,
          address,
          city,
          province,
          country,
          description,

          propertyType,

          latitude:
            coordinates.latitude,
          longitude:
            coordinates.longitude,

          universityId,

          distanceToUniversityKm:
            distanceKm,

          monthlyRent: rentAmount,

          roomType,
          genderPreference,

          status: "DRAFT",
          isActive: true,
        },
      });

    return NextResponse.json(
      {
        message:
          "Listing created successfully.",
        listing,
      },
      { status: 201 }
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
      { status: 500 }
    );
  }
}