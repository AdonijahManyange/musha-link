import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase-admin";

const BUCKET = "verification-documents";

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  { params }: Props
) {
  try {
    // ------------------------------------------------------------
    // ADMIN AUTHENTICATION
    // ------------------------------------------------------------

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

    // ------------------------------------------------------------
    // GET VERIFICATION
    // ------------------------------------------------------------

    const { id } = await params;

    const verification =
      await prisma.landlordVerification.findUnique({
        where: {
          id,
        },
        select: {
          titleDeedUrl: true,
        },
      });

    if (!verification) {
      return NextResponse.json(
        { error: "Verification not found." },
        { status: 404 }
      );
    }

    if (!verification.titleDeedUrl) {
      return NextResponse.json(
        { error: "No title deed has been uploaded." },
        { status: 404 }
      );
    }

    // ------------------------------------------------------------
    // CREATE TEMPORARY SIGNED URL
    // ------------------------------------------------------------

    const { data, error } =
      await supabaseAdmin.storage
        .from(BUCKET)
        .createSignedUrl(
          verification.titleDeedUrl,
          60 * 10
        );

    if (error || !data?.signedUrl) {
      console.error(
        "Failed to create title deed signed URL:",
        error
      );

      return NextResponse.json(
        { error: "Unable to access title deed." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: data.signedUrl,
    });
  } catch (error) {
    console.error(
      "Title deed access error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to access title deed." },
      { status: 500 }
    );
  }
}