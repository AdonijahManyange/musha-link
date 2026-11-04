import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function storagePathFromPublicUrl(url: string, bucket: string) {
  try {
    const pathname = new URL(url).pathname;
    const marker = `/storage/v1/object/public/${bucket}/`;
    const markerIndex = pathname.indexOf(marker);

    return markerIndex === -1
      ? null
      : decodeURIComponent(pathname.slice(markerIndex + marker.length));
  } catch {
    return null;
  }
}

export async function DELETE() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
    }

    const account = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        studentProfile: { select: { profilePhotoUrl: true } },
        landlordProfile: {
          select: { profilePhotoUrl: true, coverPhotoUrl: true },
        },
        verificationDocuments: { select: { filePath: true } },
        listings: { select: { photos: { select: { url: true } } } },
      },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    const deletions: Array<{ bucket: string; paths: string[] }> = [
      {
        bucket: "student-profiles",
        paths: [
          `${user.id}/profile`,
          ...(account.studentProfile?.profilePhotoUrl
            ? [storagePathFromPublicUrl(account.studentProfile.profilePhotoUrl, "student-profiles")]
            : []),
        ].filter((path): path is string => Boolean(path)),
      },
      {
        bucket: "landlord-profiles",
        paths: [
          `${user.id}/profile`,
          `${user.id}/cover`,
          ...(account.landlordProfile?.profilePhotoUrl
            ? [storagePathFromPublicUrl(account.landlordProfile.profilePhotoUrl, "landlord-profiles")]
            : []),
          ...(account.landlordProfile?.coverPhotoUrl
            ? [storagePathFromPublicUrl(account.landlordProfile.coverPhotoUrl, "landlord-profiles")]
            : []),
        ].filter((path): path is string => Boolean(path)),
      },
      {
        bucket: "verification-documents",
        paths: account.verificationDocuments.map((document) => document.filePath),
      },
      {
        bucket: "listing-photos",
        paths: account.listings.flatMap((listing) =>
          listing.photos
            .map((photo) => storagePathFromPublicUrl(photo.url, "listing-photos"))
            .filter((path): path is string => Boolean(path))
        ),
      },
    ];

    for (const { bucket, paths } of deletions) {
      const uniquePaths = [...new Set(paths)];
      if (uniquePaths.length === 0) continue;

      const { error } = await supabase.storage.from(bucket).remove(uniquePaths);
      if (error) {
        console.error(`Failed to remove ${bucket} files during account deletion:`, error);
        return NextResponse.json(
          { error: "We could not remove your stored files. Please try again." },
          { status: 500 }
        );
      }
    }

    await prisma.user.delete({ where: { id: user.id } });

    return NextResponse.json({ message: "Account deleted successfully." });
  } catch (error) {
    console.error("Failed to delete account:", error);
    return NextResponse.json(
      { error: "Something went wrong while deleting your account." },
      { status: 500 }
    );
  }
}
