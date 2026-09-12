import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET_NAME = "student-profiles";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

/* ============================================================
   POST — Upload student profile photo
============================================================ */

export async function POST(request: Request) {
  try {
    const session = await auth();
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* --------------------------------------------------------
       Find the authenticated student
    -------------------------------------------------------- */

    const user = await prisma.user.findUnique({
      where: {
        email,
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

    if (user.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Student access required." },
        { status: 403 }
      );
    }

    /* --------------------------------------------------------
       Get uploaded file
    -------------------------------------------------------- */

    const formData = await request.formData();

    const file = formData.get("file");

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

    if (!ALLOWED_TYPES.includes(file.type)) {
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

    if (file.size > MAX_FILE_SIZE) {
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

    const arrayBuffer = await file.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    /* --------------------------------------------------------
       Fixed storage path

       A predictable path means a new profile photo replaces
       the previous one instead of creating unlimited files.
    -------------------------------------------------------- */

    const storagePath = `${user.id}/profile`;

    /* --------------------------------------------------------
       Upload to Supabase Storage
    -------------------------------------------------------- */

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error(
        "Supabase student profile upload error:",
        uploadError
      );

      return NextResponse.json(
        {
          error: uploadError.message,
        },
        { status: 500 }
      );
    }

    /* --------------------------------------------------------
       Get public URL
    -------------------------------------------------------- */

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath);

    const publicUrl =
      `${publicUrlData.publicUrl}?v=${Date.now()}`;

    /* --------------------------------------------------------
       Save URL to StudentProfile
    -------------------------------------------------------- */

    const profile = await prisma.studentProfile.upsert({
      where: {
        userId: user.id,
      },

      create: {
        userId: user.id,
        profilePhotoUrl: publicUrl,
      },

      update: {
        profilePhotoUrl: publicUrl,
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
      "POST student profile photo error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to upload profile photo.",
      },
      { status: 500 }
    );
  }
}