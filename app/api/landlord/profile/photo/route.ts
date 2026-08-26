import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET_NAME = "landlord-profiles";

const MAX_FILE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

/* ============================================================
   POST — Upload landlord profile photo
============================================================ */

export async function POST(
  request: Request
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData =
      await request.formData();

    const file =
      formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "No image was provided.",
        },
        { status: 400 }
      );
    }

    /* --------------------------------------------------------
       Validate file type
    -------------------------------------------------------- */

    if (
      !ALLOWED_TYPES.includes(
        file.type
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Only JPG, PNG, or WEBP images are allowed.",
        },
        { status: 400 }
      );
    }

    /* --------------------------------------------------------
       Validate file size
    -------------------------------------------------------- */

    if (
      file.size > MAX_FILE_SIZE
    ) {
      return NextResponse.json(
        {
          error:
            "Profile photo must be 5MB or smaller.",
        },
        { status: 400 }
      );
    }

    /* --------------------------------------------------------
       Convert file
    -------------------------------------------------------- */

    const arrayBuffer =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(arrayBuffer);

    /* --------------------------------------------------------
       Fixed storage path
       
       Using a predictable path means uploading a new
       profile photo replaces the old one.
    -------------------------------------------------------- */

    const storagePath =
      `${session.user.id}/profile`;

    /* --------------------------------------------------------
       Upload to Supabase
    -------------------------------------------------------- */

    const {
      error: uploadError,
    } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(
        storagePath,
        buffer,
        {
          contentType: file.type,
          upsert: true,
        }
      );

    if (uploadError) {
      console.error(
        "Supabase profile upload error:",
        uploadError
      );

      return NextResponse.json(
        {
          error:
            "Failed to upload profile photo.",
        },
        { status: 500 }
      );
    }

    /* --------------------------------------------------------
       Get public URL
    -------------------------------------------------------- */

    const {
      data: publicUrlData,
    } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(
        storagePath
      );

    const publicUrl =
      `${publicUrlData.publicUrl}?v=${Date.now()}`;

    /* --------------------------------------------------------
       Save URL to Prisma
    -------------------------------------------------------- */

    const profile =
      await prisma.landlordProfile.upsert({
        where: {
          userId: session.user.id,
        },

        create: {
          userId: session.user.id,
          profilePhotoUrl:
            publicUrl,
        },

        update: {
          profilePhotoUrl:
            publicUrl,
        },
      });

    return NextResponse.json(
      {
        message:
          "Profile photo uploaded successfully.",

        profilePhotoUrl:
          profile.profilePhotoUrl,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "POST landlord profile photo error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to upload profile photo.",
      },
      { status: 500 }
    );
  }
}