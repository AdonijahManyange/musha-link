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

const ALLOWED_DOCUMENT_TYPES = [
  "WATER_BILL",
  "ELECTRICITY_BILL",
  "TITLE_DEED",
] as const;

type DocumentType = (typeof ALLOWED_DOCUMENT_TYPES)[number];

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
        {
          error:
            "Only landlords can upload verification documents.",
        },
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
            "Please start landlord verification before uploading verification documents.",
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
            "You must complete identity verification before uploading verification documents.",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // GET FILE + DOCUMENT TYPE
    // ------------------------------------------------------------

    const formData = await request.formData();

    const file = formData.get("file");
    const type = formData.get("type");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "Please upload a verification document.",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // VALIDATE DOCUMENT TYPE
    // ------------------------------------------------------------

    if (
      typeof type !== "string" ||
      !ALLOWED_DOCUMENT_TYPES.includes(
        type as DocumentType
      )
    ) {
      return NextResponse.json(
        {
          error: "Invalid verification document type.",
        },
        { status: 400 }
      );
    }

    const documentType = type as DocumentType;

    // ------------------------------------------------------------
    // VALIDATE FILE TYPE
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

    // ------------------------------------------------------------
    // VALIDATE FILE SIZE
    // ------------------------------------------------------------

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error:
            "File is too large. Maximum size is 10 MB.",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // DETERMINE FILE EXTENSION
    // ------------------------------------------------------------

    const extension =
      file.type === "application/pdf"
        ? "pdf"
        : file.type === "image/png"
          ? "png"
          : "jpg";

    // ------------------------------------------------------------
    // CREATE STORAGE PATH
    // ------------------------------------------------------------

    const filePath =
      `landlords/${user.id}/verification/${documentType}/${Date.now()}.${extension}`;

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
        "Verification document upload error:",
        uploadError
      );

      return NextResponse.json(
        {
          error:
            "Failed to upload verification document.",
        },
        { status: 500 }
      );
    }

    // ------------------------------------------------------------
    // SAVE DOCUMENT RECORD
    // ------------------------------------------------------------

    await prisma.verificationDocument.upsert({
      where: {
        userId_type: {
          userId: user.id,
          type: documentType,
        },
      },
      update: {
        filePath,
        fileName: file.name,
        status: "PENDING",
        reviewedAt: null,
      },
      create: {
        userId: user.id,
        type: documentType,
        filePath,
        fileName: file.name,
        status: "PENDING",
      },
    });

    // ------------------------------------------------------------
    // UPDATE OVERALL VERIFICATION STATUS
    // ------------------------------------------------------------

    await prisma.landlordVerification.update({
      where: {
        landlordId: user.id,
      },
      data: {
        status: "PENDING",
        rejectionReason: null,
        reviewedAt: null,
        submittedAt: new Date(),
      },
    });

    // ------------------------------------------------------------
    // SUCCESS
    // ------------------------------------------------------------

    return NextResponse.json({
      success: true,
      message:
        "Verification document uploaded successfully.",
    });
  } catch (error) {
    console.error(
      "Verification document upload error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while uploading the verification document.",
      },
      { status: 500 }
    );
  }
}