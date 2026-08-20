import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ListingActions from "./ListingActions";

type ListingPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ListingPage({
  params,
}: ListingPageProps) {
  const { id } = await params;

  const listing =
    await prisma.listing.findUnique({
      where: {
        id,
      },
      include: {
        university: true,
        photos: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

  if (!listing) {
    notFound();
  }

  const photoCount =
    listing.photos.length;

  const canPublish =
    listing.status === "DRAFT" &&
    photoCount >= 5;

  const coverPhoto =
    listing.photos.find(
      (photo) => photo.isCover
    ) || listing.photos[0];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">

        {/* Back */}

        <Link
          href="/dashboard/landlord/listings"
          className="text-sm font-medium text-slate-600 transition hover:text-brand-blue"
        >
          ← Back to My Listings
        </Link>

        {/* Header */}

        <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:flex-row sm:items-start sm:justify-between">

          <div className="min-w-0">

            <p className="text-sm font-medium text-brand-blue">
              Landlord Dashboard
            </p>

            <h1 className="mt-2 break-words text-2xl font-bold text-slate-900 sm:text-3xl">
              {listing.title}
            </h1>

            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              {listing.address},{" "}
              {listing.city},{" "}
              {listing.province},{" "}
              {listing.country}
            </p>

          </div>

          {/* Status */}

          <span
            className={`inline-flex w-fit shrink-0 rounded-full border px-3 py-1 text-sm font-semibold ${
              listing.status ===
              "PUBLISHED"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : listing.status ===
                    "DRAFT"
                  ? "border-amber-200 bg-amber-50 text-amber-700"
                  : "border-slate-200 bg-slate-100 text-slate-600"
            }`}
          >
            {listing.status ===
            "PUBLISHED"
              ? "Published"
              : listing.status ===
                  "DRAFT"
                ? "Draft"
                : "Archived"}
          </span>

        </div>

        {/* Photos */}

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col sm:flex-row">

            {/* Cover Photo */}

            <div className="relative aspect-[4/3] w-full bg-slate-100 sm:aspect-auto sm:h-64 sm:w-80 sm:shrink-0">

              {coverPhoto ? (
                <>
                  <img
                    src={coverPhoto.url}
                    alt={listing.title}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute bottom-3 left-3 rounded-lg bg-black/70 px-3 py-1.5 text-xs font-medium text-white">
                    {photoCount}{" "}
                    {photoCount === 1
                      ? "photo"
                      : "photos"}
                  </div>
                </>
              ) : (
                <div className="flex h-full min-h-56 items-center justify-center">
                  <div className="text-center">

                    <div className="text-5xl">
                      🏠
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      No photos yet
                    </p>

                  </div>
                </div>
              )}

            </div>

            {/* Photo Information */}

            <div className="flex flex-1 flex-col justify-center p-5 sm:p-6">

              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Listing Photos
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                {photoCount}/10 photos
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                {photoCount < 5
                  ? `Add ${
                      5 - photoCount
                    } more ${
                      5 - photoCount ===
                      1
                        ? "photo"
                        : "photos"
                    } before publishing.`
                  : "Your listing has enough photos to publish."}
              </p>

              {/* Progress */}

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">

                <div
                  className="h-full rounded-full bg-brand-blue transition-all"
                  style={{
                    width: `${Math.min(
                      (photoCount /
                        10) *
                        100,
                      100
                    )}%`,
                  }}
                />

              </div>

              <Link
                href={`/dashboard/landlord/listings/${listing.id}/photos`}
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-fit"
              >
                Manage Photos
              </Link>

            </div>

          </div>

        </section>

        {/* Property Details */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <h2 className="text-lg font-semibold text-slate-900">
            Property Details
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {/* University */}

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                University
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {listing.university.name}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {listing.university.city}
              </p>
            </div>

            {/* Distance */}

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Distance
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {listing.distanceToUniversityKm !==
                null
                  ? `${listing.distanceToUniversityKm.toFixed(
                      1
                    )} km`
                  : "Not available"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                from university
              </p>
            </div>

            {/* Rent */}

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Monthly Rent
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                ${listing.monthlyRent}
              </p>
            </div>

            {/* Room */}

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Room Type
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {formatRoomType(
                  listing.roomType
                )}
              </p>
            </div>

          </div>

          {/* Gender */}

          <div className="mt-6 border-t border-slate-100 pt-6">

            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Gender Preference
            </p>

            <p className="mt-2 font-semibold text-slate-900">
              {formatGenderPreference(
                listing.genderPreference
              )}
            </p>

          </div>

        </section>

        {/* Description */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <h2 className="text-lg font-semibold text-slate-900">
            Description
          </h2>

          <p className="mt-4 whitespace-pre-line leading-7 text-slate-600">
            {listing.description}
          </p>

        </section>

        {/* Location */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <h2 className="text-lg font-semibold text-slate-900">
            Location
          </h2>

          <p className="mt-3 text-slate-600">
            {listing.address},{" "}
            {listing.city},{" "}
            {listing.province},{" "}
            {listing.country}
          </p>

          {listing.latitude !==
            null &&
            listing.longitude !==
              null && (
              <p className="mt-2 text-sm text-slate-400">
                Coordinates:{" "}
                {listing.latitude.toFixed(
                  6
                )}
                ,{" "}
                {listing.longitude.toFixed(
                  6
                )}
              </p>
            )}

        </section>

        {/* Actions */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          <h2 className="text-lg font-semibold text-slate-900">
            Listing Actions
          </h2>

          <div className="mt-5">

            <ListingActions
              listingId={listing.id}
              status={listing.status}
              canPublish={canPublish}
            />

          </div>

        </section>

        {/* Bottom Back */}

        <div className="mt-6 pb-8">

          <Link
            href="/dashboard/landlord/listings"
            className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
          >
            ← Back to My Listings
          </Link>

        </div>

      </div>
    </main>
  );
}

/* ============================================================
   HELPERS
============================================================ */

function formatRoomType(
  roomType: string
) {
  switch (roomType) {
    case "PRIVATE":
      return "Private Room";

    case "SHARED":
      return "Shared Room";

    case "ENTIRE_PROPERTY":
      return "Entire Property";

    default:
      return roomType;
  }
}

function formatGenderPreference(
  preference: string
) {
  switch (preference) {
    case "ANY":
      return "Any Gender";

    case "MALE":
      return "Male";

    case "FEMALE":
      return "Female";

    default:
      return preference;
  }
}