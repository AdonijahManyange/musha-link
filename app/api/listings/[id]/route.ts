import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// ============================================================
// GET — Get single listing
// ============================================================

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    if (user.role !== "LANDLORD") {
      return NextResponse.json(
        {
          error: "Only landlords can access listings.",
        },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const listing = await prisma.listing.findFirst({
      where: {
        id,
        landlordId: user.id,
      },
      include: {
        university: true,
        photos: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    if (!listing) {
      return NextResponse.json(
        {
          error: "Listing not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      listing,
    });
  } catch (error) {
    console.error(
      "Failed to load listing:",
      error
    );

    return NextResponse.json(
      {
        error: "Something went wrong while loading the listing.",
      },
      { status: 500 }
    );
  }
}

// ============================================================
// PUT — Update listing details
// ============================================================

export async function PUT(
  request: Request,
  context: RouteContext
) {
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
        { status: 401 }
      );
    }

    // ----------------------------------------------------------
    // Landlord check
    // ----------------------------------------------------------

    if (user.role !== "LANDLORD") {
      return NextResponse.json(
        {
          error: "Only landlords can modify listings.",
        },
        { status: 403 }
      );
    }

    // ----------------------------------------------------------
    // Listing ID
    // ----------------------------------------------------------

    const { id } = await context.params;

    // ----------------------------------------------------------
    // Read request body
    // ----------------------------------------------------------

    const body = await request.json();

    const {
      title,
      propertyType,
      address,
      city,
      province,
      country,
      monthlyRent,
      roomType,
      genderPreference,
      universityId,
      description,
    } = body;

    // ----------------------------------------------------------
    // Basic validation
    // ----------------------------------------------------------

    if (
      !title ||
      !propertyType ||
      !address ||
      !city ||
      !province ||
      !country ||
      monthlyRent === undefined ||
      !roomType ||
      !genderPreference ||
      !universityId
    ) {
      return NextResponse.json(
        {
          error:
            "Please complete all required listing fields.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // Find listing and verify ownership
    // ----------------------------------------------------------

    const listing = await prisma.listing.findFirst({
      where: {
        id,
        landlordId: user.id,
      },
    });

    if (!listing) {
      return NextResponse.json(
        {
          error:
            "Listing not found or you do not have permission to edit it.",
        },
        { status: 404 }
      );
    }

    // ----------------------------------------------------------
    // Verify university exists
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
          error: "Selected university was not found.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // Update listing
    //
    // IMPORTANT:
    // We intentionally DO NOT update:
    //
    // distanceToUniversityKm
    // latitude
    // longitude
    //
    // Those values are protected/read-only.
    // ----------------------------------------------------------

    const updatedListing =
      await prisma.listing.update({
        where: {
          id: listing.id,
        },
        data: {
          title: title.trim(),
          propertyType,
          address: address.trim(),
          city: city.trim(),
          province: province.trim(),
          country: country.trim(),

          monthlyRent: Number(monthlyRent),

          roomType,
          genderPreference,

          universityId,

          description:
            typeof description === "string"
              ? description.trim()
              : "",
        },
        include: {
          university: true,
          photos: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      });

    return NextResponse.json({
      message: "Listing updated successfully.",
      listing: updatedListing,
    });
  } catch (error) {
    console.error(
      "Failed to update listing:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while updating the listing.",
      },
      { status: 500 }
    );
  }
}

// ============================================================
// PATCH — Update listing status
// ============================================================

export async function PATCH(
  request: Request,
  context: RouteContext
) {
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
        { status: 401 }
      );
    }

    // ----------------------------------------------------------
    // Landlord check
    // ----------------------------------------------------------

    if (user.role !== "LANDLORD") {
      return NextResponse.json(
        {
          error:
            "Only landlords can modify listings.",
        },
        { status: 403 }
      );
    }

    // ----------------------------------------------------------
    // Listing ID
    // ----------------------------------------------------------

    const { id } = await context.params;

    // ----------------------------------------------------------
    // Read request body
    // ----------------------------------------------------------

    const body = await request.json();

    const { status } = body;

    // ----------------------------------------------------------
    // Validate status
    // ----------------------------------------------------------

    const validStatuses = [
      "DRAFT",
      "PUBLISHED",
      "ARCHIVED",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: "Invalid listing status.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // Find listing and verify ownership
    // ----------------------------------------------------------

    const listing =
      await prisma.listing.findFirst({
        where: {
          id,
          landlordId: user.id,
        },
        include: {
          photos: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      });

    if (!listing) {
      return NextResponse.json(
        {
          error:
            "Listing not found or you do not have permission to modify it.",
        },
        { status: 404 }
      );
    }

    // ==========================================================
    // PUBLISHING
    // ==========================================================

    if (status === "PUBLISHED") {
      const photoCount =
        listing.photos.length;

      if (photoCount < 5) {
        return NextResponse.json(
          {
            error:
              "You need at least 5 photos before publishing this listing.",
          },
          { status: 400 }
        );
      }

      if (listing.status === "ARCHIVED") {
        return NextResponse.json(
          {
            error:
              "Archived listings cannot be published. Please restore the listing first.",
          },
          { status: 400 }
        );
      }

      const updatedListing =
        await prisma.listing.update({
          where: {
            id: listing.id,
          },
          data: {
            status: "PUBLISHED",
            isActive: true,
          },
        });

      return NextResponse.json({
        message:
          "Listing published successfully.",
        listing: updatedListing,
      });
    }

    // ==========================================================
    // ARCHIVING
    // ==========================================================

    if (status === "ARCHIVED") {
      if (listing.status === "ARCHIVED") {
        return NextResponse.json(
          {
            error:
              "This listing is already archived.",
          },
          { status: 400 }
        );
      }

      const updatedListing =
        await prisma.listing.update({
          where: {
            id: listing.id,
          },
          data: {
            status: "ARCHIVED",
            isActive: false,
          },
        });

      return NextResponse.json({
        message:
          "Listing archived successfully.",
        listing: updatedListing,
      });
    }

    // ==========================================================
    // DRAFT
    // ==========================================================

    if (status === "DRAFT") {
      const updatedListing =
        await prisma.listing.update({
          where: {
            id: listing.id,
          },
          data: {
            status: "DRAFT",
            isActive: false,
          },
        });

      return NextResponse.json({
        message:
          "Listing moved back to draft.",
        listing: updatedListing,
      });
    }

    return NextResponse.json(
      {
        error:
          "Unable to update listing status.",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error(
      "Failed to update listing:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while updating the listing.",
      },
      { status: 500 }
    );
  }
}