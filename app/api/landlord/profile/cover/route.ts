import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET_NAME = "landlord-profiles";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

/* ============================================================
   POST — Upload landlord profile cover photo
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

    /* --------------------------------------------------------
       Find the actual Prisma user
    -------------------------------------------------------- */

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },

      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    if (user.role !== "LANDLORD") {
      return NextResponse.json(
        {
          error:
            "Landlord access required.",
        },
        { status: 403 }
      );
    }

    /* --------------------------------------------------------
       Read file
    -------------------------------------------------------- */

    const formData =
      await request.formData();

    const file =
      formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error:
            "No cover image was provided.",
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
            "Cover photo must be 10MB or smaller.",
        },
        { status: 400 }
      );
    }

    /* --------------------------------------------------------
       Convert file to buffer
    -------------------------------------------------------- */

    const arrayBuffer =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(arrayBuffer);

    /* --------------------------------------------------------
       Storage path
       
       Fixed path means a new cover replaces
       the previous cover image.
    -------------------------------------------------------- */

    const storagePath =
      `${user.id}/cover`;

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
        "Supabase cover upload error:",
        uploadError
      );

      return NextResponse.json(
        {
          error:
            "Failed to upload cover photo.",
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
          userId: user.id,
        },

        create: {
          userId: user.id,
          coverPhotoUrl:
            publicUrl,
        },

        update: {
          coverPhotoUrl:
            publicUrl,
        },
      });

    return NextResponse.json(
      {
        message:
          "Cover photo uploaded successfully.",

        coverPhotoUrl:
          profile.coverPhotoUrl,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "POST landlord cover photo error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to upload cover photo.",
      },
      { status: 500 }
    );
  }
}