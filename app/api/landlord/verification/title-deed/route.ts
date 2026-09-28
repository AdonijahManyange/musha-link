import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase-admin";

const BUCKET = "verification-documents";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];

export async function POST(request: Request) {
  try {
    // ------------------------------------------------------------
    // AUTHENTICATION
    // ------------------------------------------------------------

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    if (user.role !== "LANDLORD") {
      return NextResponse.json(
        { error: "Only landlords can upload a title deed." },
        { status: 403 }
      );
    }

    // ------------------------------------------------------------
    // GET VERIFICATION
    // ------------------------------------------------------------

    const verification =
      await prisma.landlordVerification.findUnique({
        where: {
          landlordId: user.id,
        },
      });

    if (!verification) {
      return NextResponse.json(
        {
          error:
            "Please start landlord verification before uploading your title deed.",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // REQUIRE DIDIT IDENTITY VERIFICATION
    // ------------------------------------------------------------

    if (
      !verification.identityVerified ||
      !verification.livenessVerified ||
      !verification.faceMatchVerified
    ) {
      return NextResponse.json(
        {
          error:
            "You must complete identity verification before uploading your title deed.",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // GET FILE
    // ------------------------------------------------------------

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please upload a title deed file." },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // VALIDATE FILE
    // ------------------------------------------------------------

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Please upload a PDF, JPG, or PNG.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "File is too large. Maximum size is 10 MB.",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // CREATE STORAGE PATH
    // ------------------------------------------------------------

    const extension =
      file.type === "application/pdf"
        ? "pdf"
        : file.type === "image/png"
          ? "png"
          : "jpg";

    const filePath =
      `title-deeds/${user.id}/${Date.now()}.${extension}`;

    // ------------------------------------------------------------
    // UPLOAD TO PRIVATE SUPABASE BUCKET
    // ------------------------------------------------------------

    const fileBuffer = Buffer.from(
      await file.arrayBuffer()
    );

    const { error: uploadError } =
      await supabaseAdmin.storage
        .from(BUCKET)
        .upload(filePath, fileBuffer, {
          contentType: file.type,
          upsert: false,
        });

    if (uploadError) {
      console.error(
        "Title deed upload error:",
        uploadError
      );

      return NextResponse.json(
        {
          error: "Failed to upload title deed.",
        },
        { status: 500 }
      );
    }

    // ------------------------------------------------------------
    // SAVE STORAGE PATH
    // ------------------------------------------------------------

    await prisma.landlordVerification.update({
      where: {
        landlordId: user.id,
      },
      data: {
        titleDeedUrl: filePath,
        titleDeedStatus: "PENDING",
        status: "PENDING",
        rejectionReason: null,
        reviewedAt: null,
        submittedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Title deed uploaded successfully.",
    });
  } catch (error) {
    console.error(
      "Title deed upload error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while uploading the title deed.",
      },
      { status: 500 }
    );
  }
}