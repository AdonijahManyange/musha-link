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
        isActive: true,
      },
      include: {
        university: {
          select: {
            name: true,
            city: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error("Failed to fetch listings:", error);

    return NextResponse.json(
      { error: "Something went wrong while loading listings." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    // Only landlords can create listings
    if (user.role !== "LANDLORD") {
      return NextResponse.json(
        { error: "Only landlords can create listings." },
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
        roomType,
        genderPreference,
        description,
        } = body;

    // Basic validation
    if (
        !title ||
        !address ||
        !city ||
        !province ||
        !country ||
        !universityId ||
        !monthlyRent ||
        !roomType ||
        !genderPreference ||
        !description
        ) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 }
      );
    }

    // Find the selected university
    const university = await prisma.university.findUnique({
      where: {
        id: universityId,
      },
    });

    if (!university) {
      return NextResponse.json(
        { error: "Selected university could not be found." },
        { status: 400 }
      );
    }

    // Convert property address into coordinates
    const fullAddress = `${address}, ${city}, ${province}, ${country}`;
    const coordinates = await geocodeAddress(fullAddress);

    if (!coordinates) {
      return NextResponse.json(
        {
          error:
            "We couldn't find that property address. Please check the address and try again.",
        },
        { status: 400 }
      );
    }

    // Calculate distance between property and university
    const distanceKm = calculateDistanceKm(
      coordinates.latitude,
      coordinates.longitude,
      university.latitude,
      university.longitude
    );

    // Create listing
    const listing = await prisma.listing.create({
  data: {
    landlordId: user.id,

    title,
    address,
    city,
    province,
    country,
    description,

    latitude: coordinates.latitude,
    longitude: coordinates.longitude,

    universityId,

    distanceToUniversityKm: distanceKm,

    monthlyRent: Number(monthlyRent),

    roomType,
    genderPreference,
  },
});

    return NextResponse.json(
      {
        message: "Listing created successfully.",
        listing,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create listing:", error);

    return NextResponse.json(
      { error: "Something went wrong while creating the listing." },
      { status: 500 }
    );
  }
}