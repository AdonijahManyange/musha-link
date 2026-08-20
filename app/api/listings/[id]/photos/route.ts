import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MAX_PHOTOS = 10;

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
            "Only landlords can manage listing photos.",
        },
        { status: 403 }
      );
    }

    const { id: listingId } = await context.params;

    const listing = await prisma.listing.findFirst({
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

    return NextResponse.json({
      listingId: listing.id,
      photos: listing.photos,
      photoCount: listing.photos.length,
      maxPhotos: MAX_PHOTOS,
      canPublish: listing.photos.length >= 5,
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
        { error: "You must be logged in." },
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

    const { id: listingId } = await context.params;

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
            "You can upload a maximum of 10 photos per listing.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // Read uploaded file
    // ----------------------------------------------------------

    const formData =
      await request.formData();

    const file =
      formData.get("file");

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
          error: "Only landlords can manage listing photos.",
        },
        { status: 403 }
      );
    }

    const { id: listingId } = await context.params;

    const body = await request.json();
    const photoId = body.photoId;

    if (!photoId) {
      return NextResponse.json(
        { error: "Photo ID is required." },
        { status: 400 }
      );
    }

    // Verify listing ownership
    const listing = await prisma.listing.findFirst({
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

    // Find photo
    const photo = await prisma.listingPhoto.findFirst({
      where: {
        id: photoId,
        listingId,
      },
    });

    if (!photo) {
      return NextResponse.json(
        { error: "Photo not found." },
        { status: 404 }
      );
    }

    // Delete from Supabase Storage
    const marker = "/listing-photos/";

    const markerIndex = photo.url.indexOf(marker);

    if (markerIndex !== -1) {
      const storagePath = decodeURIComponent(
        photo.url.substring(
          markerIndex + marker.length
        )
      );

      const { error: storageError } =
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

    // Delete database record
    await prisma.listingPhoto.delete({
      where: {
        id: photo.id,
      },
    });

    // Re-number remaining photos
    const remainingPhotos =
      await prisma.listingPhoto.findMany({
        where: {
          listingId,
        },
        orderBy: {
          sortOrder: "asc",
        },
      });

    for (let index = 0; index < remainingPhotos.length; index++) {
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
      message: "Photo deleted successfully.",
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
          error: "Only landlords can manage listing photos.",
        },
        { status: 403 }
      );
    }

    const { id: listingId } = await context.params;

    const body = await request.json();

    const photoIds = body.photoIds;

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

    // Verify listing ownership
    const listing = await prisma.listing.findFirst({
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

    // Get all listing photos
    const photos =
      await prisma.listingPhoto.findMany({
        where: {
          listingId,
        },
      });

    // Make sure every supplied ID belongs to this listing
    const photoIdSet = new Set(
      photos.map((photo) => photo.id)
    );

    const validIds =
      photoIds.length === photos.length &&
      photoIds.every((id) =>
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

    // Update ordering
    await prisma.$transaction(
      photoIds.map(
        (photoId: string, index: number) =>
          prisma.listingPhoto.update({
            where: {
              id: photoId,
            },
            data: {
              sortOrder: index,
              isCover: index === 0,
            },
          })
      )
    );

    return NextResponse.json({
      message: "Photo order updated successfully.",
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