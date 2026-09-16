import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================
// PHOTO CONFIGURATION
// ============================================================

// Maximum number of photos allowed per listing.
// 10 photos are required for publishing, but landlords can
// upload up to 20 photos for additional property coverage.
const MAX_PHOTOS = 20;
const MIN_PHOTOS_TO_PUBLISH = 10;

// All supported photo categories.
const PHOTO_CATEGORIES = [
  "LIVING_ROOM",
  "BEDROOM",
  "BATHROOM",
  "FRONT_YARD",
  "PARKING",
  "MAIN_ENTRANCE",
  "VERANDA",
  "BED",
  "CORRIDOR",
  "BACK_YARD",
] as const;

type PhotoCategory =
  (typeof PHOTO_CATEGORIES)[number];

// Minimum number of photos required in each category
// before a listing can be published.
//
// Required:
// Living Room     = 2
// Bedrooms        = 2
// Bathrooms       = 2
// Front Yard      = 1
// Parking         = 1
// Main Entrance   = 1
// Veranda         = 1
//
// Total required = 10 photos.
//
// Optional categories have a requirement of 0.
const REQUIRED_PHOTO_CATEGORIES: Record<
  PhotoCategory,
  number
> = {
  LIVING_ROOM: 2,
  BEDROOM: 2,
  BATHROOM: 2,
  FRONT_YARD: 1,
  PARKING: 1,
  MAIN_ENTRANCE: 1,
  VERANDA: 1,

  // Optional categories
  BED: 0,
  CORRIDOR: 0,
  BACK_YARD: 0,
};

type RouteContext = {
  params: Promise<{ id: string }>;
};

// ============================================================
// GET — Load listing photos
// ============================================================

export async function GET(
  _request: Request,
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
            "Only landlords can manage listing photos.",
        },
        { status: 403 }
      );
    }

    // ----------------------------------------------------------
    // Listing ID
    // ----------------------------------------------------------

    const { id: listingId } =
      await context.params;

    // ----------------------------------------------------------
    // Find listing and verify ownership
    // ----------------------------------------------------------

    const listing =
      await prisma.listing.findFirst({
        where: {
          id: listingId,
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
            "Listing not found or you do not have permission to access it.",
        },
        { status: 404 }
      );
    }

    // ----------------------------------------------------------
    // Calculate category counts
    // ----------------------------------------------------------

    const categoryCounts =
      Object.fromEntries(
        PHOTO_CATEGORIES.map(
          (category) => [
            category,
            listing.photos.filter(
              (photo) =>
                photo.category === category
            ).length,
          ]
        )
      ) as Record<PhotoCategory, number>;

    // ----------------------------------------------------------
    // Determine missing required categories
    // ----------------------------------------------------------

    const missingCategories =
      PHOTO_CATEGORIES.filter(
        (category) =>
          categoryCounts[category] <
          REQUIRED_PHOTO_CATEGORIES[
            category
          ]
      );

    const totalRequiredPhotos =
      Object.values(
        REQUIRED_PHOTO_CATEGORIES
      ).reduce(
        (total, required) =>
          total + required,
        0
      );

    // ----------------------------------------------------------
    // Return photo information
    // ----------------------------------------------------------

    return NextResponse.json({
      listingId: listing.id,
      photos: listing.photos,
      photoCount: listing.photos.length,

      maxPhotos: MAX_PHOTOS,
      minPhotosToPublish:
        MIN_PHOTOS_TO_PUBLISH,

      totalRequiredPhotos,

      categoryCounts,
      missingCategories,

      canPublish:
        missingCategories.length === 0,
    });
  } catch (error) {
    console.error(
      "Failed to fetch listing photos:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while loading listing photos.",
      },
      { status: 500 }
    );
  }
}

// ============================================================
// POST — Upload listing photo
// ============================================================

export async function POST(
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
            "Only landlords can upload listing photos.",
        },
        { status: 403 }
      );
    }

    // ----------------------------------------------------------
    // Listing ID
    // ----------------------------------------------------------

    const { id: listingId } =
      await context.params;

    // ----------------------------------------------------------
    // Verify listing ownership
    // ----------------------------------------------------------

    const listing =
      await prisma.listing.findFirst({
        where: {
          id: listingId,
          landlordId: user.id,
        },
        include: {
          _count: {
            select: {
              photos: true,
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

    // ----------------------------------------------------------
    // Current photo count
    // ----------------------------------------------------------

    const currentPhotoCount =
      listing._count.photos;

    if (currentPhotoCount >= MAX_PHOTOS) {
      return NextResponse.json(
        {
          error:
            "You can upload a maximum of 20 photos per listing.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // Read form data
    // ----------------------------------------------------------

    const formData =
      await request.formData();

    const file =
      formData.get("file");

    const category =
      formData.get("category");

    // ----------------------------------------------------------
    // Validate file
    // ----------------------------------------------------------

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error:
            "Please provide an image file.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // Validate category
    // ----------------------------------------------------------

    if (
      typeof category !== "string" ||
      !PHOTO_CATEGORIES.includes(
        category as PhotoCategory
      )
    ) {
      return NextResponse.json(
        {
          error:
            "A valid photo category is required.",
        },
        { status: 400 }
      );
    }

    const photoCategory =
      category as PhotoCategory;

    // ----------------------------------------------------------
    // Validate file type
    // ----------------------------------------------------------

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Only JPG, PNG, and WEBP images are allowed.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // Validate file size
    // ----------------------------------------------------------

    const MAX_FILE_SIZE =
      10 * 1024 * 1024;

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error:
            "Each image must be 10MB or smaller.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // Determine photo order
    // ----------------------------------------------------------

    const sortOrder =
      currentPhotoCount;

    // The very first uploaded photo becomes
    // the cover photo automatically.
    const isCover =
      currentPhotoCount === 0;

    // ----------------------------------------------------------
    // Create safe file name
    // ----------------------------------------------------------

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() || "jpg";

    const fileName =
      `${crypto.randomUUID()}.${extension}`;

    // ----------------------------------------------------------
    // Storage path
    // ----------------------------------------------------------

    const storagePath =
      `${user.id}/${listingId}/${fileName}`;

    // ----------------------------------------------------------
    // Convert file to buffer
    // ----------------------------------------------------------

    const arrayBuffer =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(arrayBuffer);

    // ----------------------------------------------------------
    // Upload to Supabase Storage
    // ----------------------------------------------------------

    const { error: uploadError } =
      await supabase.storage
        .from("listing-photos")
        .upload(
          storagePath,
          buffer,
          {
            contentType: file.type,
            upsert: false,
          }
        );

    if (uploadError) {
      console.error(
        "Supabase upload error:",
        uploadError
      );

      return NextResponse.json(
        {
          error:
            "Failed to upload the image.",
        },
        { status: 500 }
      );
    }

    // ----------------------------------------------------------
    // Get public URL
    // ----------------------------------------------------------

    const {
      data: publicUrlData,
    } =
      supabase.storage
        .from("listing-photos")
        .getPublicUrl(storagePath);

    const publicUrl =
      publicUrlData.publicUrl;

    // ----------------------------------------------------------
    // Save photo metadata in Prisma
    // ----------------------------------------------------------

    const photo =
      await prisma.listingPhoto.create({
        data: {
          listingId,
          url: publicUrl,
          fileName: file.name,
          sortOrder,
          isCover,
          category: photoCategory,
        },
      });

    // ----------------------------------------------------------
    // Return result
    // ----------------------------------------------------------

    return NextResponse.json(
      {
        message:
          "Photo uploaded successfully.",
        photo,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Failed to upload listing photo:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while uploading the photo.",
      },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE PHOTO
// ============================================================

export async function DELETE(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
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
            "Only landlords can manage listing photos.",
        },
        { status: 403 }
      );
    }

    // ----------------------------------------------------------
    // Listing ID
    // ----------------------------------------------------------

    const { id: listingId } =
      await context.params;

    // ----------------------------------------------------------
    // Read request body
    // ----------------------------------------------------------

    const body =
      await request.json();

    const photoId =
      body.photoId;

    if (!photoId) {
      return NextResponse.json(
        {
          error:
            "Photo ID is required.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // Verify listing ownership
    // ----------------------------------------------------------

    const listing =
      await prisma.listing.findFirst({
        where: {
          id: listingId,
          landlordId: user.id,
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

    // ----------------------------------------------------------
    // Find photo
    // ----------------------------------------------------------

    const photo =
      await prisma.listingPhoto.findFirst({
        where: {
          id: photoId,
          listingId,
        },
      });

    if (!photo) {
      return NextResponse.json(
        {
          error:
            "Photo not found.",
        },
        { status: 404 }
      );
    }

    // ----------------------------------------------------------
    // Delete from Supabase Storage
    // ----------------------------------------------------------

    const marker =
      "/listing-photos/";

    const markerIndex =
      photo.url.indexOf(marker);

    if (markerIndex !== -1) {
      const storagePath =
        decodeURIComponent(
          photo.url.substring(
            markerIndex + marker.length
          )
        );

      const {
        error: storageError,
      } =
        await supabase.storage
          .from("listing-photos")
          .remove([storagePath]);

      if (storageError) {
        console.error(
          "Supabase delete error:",
          storageError
        );
      }
    }

    // ----------------------------------------------------------
    // Delete database record
    // ----------------------------------------------------------

    await prisma.listingPhoto.delete({
      where: {
        id: photo.id,
      },
    });

    // ----------------------------------------------------------
    // Re-number remaining photos
    // ----------------------------------------------------------

    const remainingPhotos =
      await prisma.listingPhoto.findMany({
        where: {
          listingId,
        },
        orderBy: {
          sortOrder: "asc",
        },
      });

    for (
      let index = 0;
      index < remainingPhotos.length;
      index++
    ) {
      await prisma.listingPhoto.update({
        where: {
          id: remainingPhotos[index].id,
        },
        data: {
          sortOrder: index,
          isCover: index === 0,
        },
      });
    }

    return NextResponse.json({
      message:
        "Photo deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Failed to delete listing photo:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while deleting the photo.",
      },
      { status: 500 }
    );
  }
}

// ============================================================
// REORDER / CHANGE COVER PHOTO
// ============================================================

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
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
            "Only landlords can manage listing photos.",
        },
        { status: 403 }
      );
    }

    // ----------------------------------------------------------
    // Listing ID
    // ----------------------------------------------------------

    const { id: listingId } =
      await context.params;

    // ----------------------------------------------------------
    // Read request body
    // ----------------------------------------------------------

    const body =
      await request.json();

    const photoIds =
      body.photoIds;

    if (
      !Array.isArray(photoIds) ||
      photoIds.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "A valid list of photo IDs is required.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // Verify listing ownership
    // ----------------------------------------------------------

    const listing =
      await prisma.listing.findFirst({
        where: {
          id: listingId,
          landlordId: user.id,
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

    // ----------------------------------------------------------
    // Get all listing photos
    // ----------------------------------------------------------

    const photos =
      await prisma.listingPhoto.findMany({
        where: {
          listingId,
        },
      });

    // ----------------------------------------------------------
    // Make sure every supplied ID belongs
    // to this listing
    // ----------------------------------------------------------

    const photoIdSet =
      new Set(
        photos.map(
          (photo) => photo.id
        )
      );

    const validIds =
      photoIds.length ===
        photos.length &&
      photoIds.every(
        (id) =>
          photoIdSet.has(id)
      );

    if (!validIds) {
      return NextResponse.json(
        {
          error:
            "Invalid photo order.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // Update ordering and cover photo
    // ----------------------------------------------------------

    await prisma.$transaction(
      photoIds.map(
        (
          photoId: string,
          index: number
        ) =>
          prisma.listingPhoto.update({
            where: {
              id: photoId,
            },
            data: {
              sortOrder: index,
              isCover:
                index === 0,
            },
          })
      )
    );

    return NextResponse.json({
      message:
        "Photo order updated successfully.",
    });
  } catch (error) {
    console.error(
      "Failed to reorder listing photos:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while reordering photos.",
      },
      { status: 500 }
    );
  }
}