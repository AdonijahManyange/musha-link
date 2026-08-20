import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
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
          error:
            "Only landlords can modify listings.",
        },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const body = await request.json();

    const { status } = body;

    if (status !== "ARCHIVED") {
      return NextResponse.json(
        {
          error:
            "Invalid listing status.",
        },
        { status: 400 }
      );
    }

    const listing =
      await prisma.listing.findFirst({
        where: {
          id,
          landlordId: user.id,
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
  } catch (error) {
    console.error(
      "Failed to archive listing:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while archiving the listing.",
      },
      { status: 500 }
    );
  }
}