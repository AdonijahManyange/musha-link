import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase-admin";

const BUCKET = "verification-documents";

type Props = {
  params: Promise<{ id: string }>;
};

const ALLOWED_DOCUMENT_TYPES = [
  "WATER_BILL",
  "ELECTRICITY_BILL",
  "TITLE_DEED",
] as const;

type DocumentType =
  (typeof ALLOWED_DOCUMENT_TYPES)[number];

export async function GET(
  request: Request,
  { params }: Props
) {
  try {
    // ----------------------------------------------------------
    // ADMIN AUTHORIZATION
    // ----------------------------------------------------------

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // ----------------------------------------------------------
    // VALIDATE DOCUMENT TYPE
    // ----------------------------------------------------------

    const { id } = await params;

    const { searchParams } = new URL(request.url);

    const requestedType = searchParams.get("type");

    if (
      !requestedType ||
      !ALLOWED_DOCUMENT_TYPES.includes(
        requestedType as DocumentType
      )
    ) {
      return NextResponse.json(
        { error: "Invalid document type." },
        { status: 400 }
      );
    }

    const documentType = requestedType as DocumentType;

    // ----------------------------------------------------------
    // FIND VERIFICATION
    // ----------------------------------------------------------

    const verification =
      await prisma.landlordVerification.findUnique({
        where: { id },
        select: {
          landlordId: true,
        },
      });

    if (!verification) {
      return NextResponse.json(
        { error: "Verification not found." },
        { status: 404 }
      );
    }

    // ----------------------------------------------------------
    // FIND THE REQUESTED DOCUMENT
    // ----------------------------------------------------------

    const document =
      await prisma.verificationDocument.findUnique({
        where: {
          userId_type: {
            userId: verification.landlordId,
            type: documentType,
          },
        },
        select: {
          filePath: true,
          fileName: true,
          status: true,
        },
      });

    if (!document) {
      return NextResponse.json(
        { error: "This document has not been uploaded." },
        { status: 404 }
      );
    }

    // ----------------------------------------------------------
    // GENERATE TEMPORARY SIGNED URL
    // ----------------------------------------------------------

    const { data, error } =
      await supabaseAdmin.storage
        .from(BUCKET)
        .createSignedUrl(
          document.filePath,
          60 * 10
        );

    if (error || !data?.signedUrl) {
      console.error(
        "Failed to create verification document URL:",
        {
          documentType,
          error,
        }
      );

      return NextResponse.json(
        { error: "Unable to access this document." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: data.signedUrl,
      fileName: document.fileName,
      status: document.status,
    });
  } catch (error) {
    console.error(
      "Verification document access error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to access the document." },
      { status: 500 }
    );
  }
}