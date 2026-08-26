import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ShieldCheck,
  MapPin,
  Home,
  Users,
  GraduationCap,
  CalendarDays,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

type ListingPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    from?: string;
  }>;
};

export default async function PublicListingPage({
  params,
  searchParams,
}: ListingPageProps) {
  const { id } = await params;
  const { from } = await searchParams;

  const backHref =
    from === "dashboard"
      ? "/dashboard/landlord/listings"
      : from === "saved"
        ? "/saved"
        : "/browse";

  const backLabel =
    from === "dashboard"
      ? "Back to My Listings"
      : from === "saved"
        ? "Back to Saved"
        : "Back to Listings";

  // ============================================================
  // LOAD LISTING
  // ============================================================

  const listing = await prisma.listing.findUnique({
    where: {
      id,
    },

    include: {
      university: true,

      landlord: {
        select: {
          id: true,
          name: true,
          verified: true,

          landlordProfile: {
            select: {
              profilePhotoUrl: true,
              city: true,
              province: true,
              country: true,
            },
          },

          _count: {
            select: {
              listings: {
                where: {
                  status: "PUBLISHED",
                  isActive: true,
                },
              },
            },
          },
        },
      },

      photos: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  // ============================================================
  // VALIDATE LISTING
  // ============================================================

  if (!listing) {
    notFound();
  }

  // Only published and active listings are publicly visible.
  if (
    listing.status !== "PUBLISHED" ||
    !listing.isActive
  ) {
    notFound();
  }

  // ============================================================
  // PHOTOS
  // ============================================================

  const coverPhoto =
    listing.photos.find(
      (photo) => photo.isCover
    ) || listing.photos[0];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ====================================================
            BACK LINK
        ==================================================== */}

        <div className="mb-6">
          <Link
            href={backHref}
            className="text-sm font-medium text-slate-600 transition hover:text-brand-blue"
          >
            ← {backLabel}
          </Link>
        </div>

        {/* ====================================================
            PHOTO GALLERY
        ==================================================== */}

        <section>
          {coverPhoto ? (
            <>
              {/* Main Photo */}

              <div className="relative overflow-hidden rounded-2xl bg-slate-200 shadow-sm">
                <div className="h-[280px] sm:h-[400px] lg:h-[500px]">
                  <img
                    src={coverPhoto.url}
                    alt={listing.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Thumbnail Strip */}

              {listing.photos.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {listing.photos.map((photo) => (
                    <div
                      key={photo.id}
                      className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 sm:h-20 sm:w-24 ${
                        photo.id === coverPhoto.id
                          ? "border-brand-blue"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt={`${listing.title} photo`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex h-[280px] items-center justify-center rounded-2xl bg-slate-200 sm:h-[400px] lg:h-[500px]">
              <div className="text-center text-slate-500">
                <Home
                  size={48}
                  className="mx-auto"
                />

                <p className="mt-3 font-medium">
                  No photos available
                </p>
              </div>
            </div>
          )}
        </section>

        {/* ====================================================
            MAIN LISTING AREA
        ==================================================== */}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">

          {/* ==================================================
              LEFT CONTENT
          ================================================== */}

          <div>

            {/* Verified Listing */}

            <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
              <ShieldCheck
                size={16}
                strokeWidth={2.5}
              />

              <span>
                Verified Listing
              </span>
            </div>

            {/* Title */}

            <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              {listing.title}
            </h1>

            {/* University */}

            <div className="mt-2 flex items-center gap-2 text-slate-700">
              <GraduationCap
                size={18}
                className="text-brand-blue"
              />

              <span className="font-medium">
                {listing.university.name}
              </span>
            </div>

            {/* Location */}

            <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
              <MapPin size={16} />

              <span>
                {listing.city},{" "}
                {listing.province}
              </span>
            </div>

            {/* ==================================================
                ABOUT
            ================================================== */}

            <section className="mt-8">
              <h2 className="text-xl font-bold text-slate-900">
                About this Property
              </h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base">
                {listing.description}
              </p>
            </section>

            {/* ==================================================
                PROPERTY DETAILS
            ================================================== */}

            <section className="mt-8">
              <h2 className="text-xl font-bold text-slate-900">
                Property Details
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                {/* Property Type */}

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                    <Home
                      size={19}
                      className="text-brand-blue"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Property Type
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {formatPropertyType(
                        listing.propertyType
                      )}
                    </p>
                  </div>
                </div>

                {/* Room Type */}

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                    <Home
                      size={19}
                      className="text-brand-blue"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Room Type
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {formatRoomType(
                        listing.roomType
                      )}
                    </p>
                  </div>
                </div>

                {/* Gender Preference */}

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                    <Users
                      size={19}
                      className="text-brand-blue"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Gender Preference
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {formatGenderPreference(
                        listing.genderPreference
                      )}
                    </p>
                  </div>
                </div>

                {/* University */}

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                    <GraduationCap
                      size={19}
                      className="text-brand-blue"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      University
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {listing.university.name}
                    </p>
                  </div>
                </div>

              </div>
            </section>

            {/* ==================================================
                LOCATION
            ================================================== */}

            <section className="mt-8">
              <h2 className="text-xl font-bold text-slate-900">
                Location
              </h2>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex gap-3">
                  <MapPin
                    size={20}
                    className="mt-0.5 shrink-0 text-brand-blue"
                  />

                  <div>
                    <p className="font-medium text-slate-900">
                      {listing.address}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {listing.city},{" "}
                      {listing.province},{" "}
                      {listing.country}
                    </p>

                    {listing.distanceToUniversityKm !==
                      null && (
                      <p className="mt-3 text-sm text-slate-500">
                        {listing.distanceToUniversityKm.toFixed(
                          1
                        )}{" "}
                        km from{" "}
                        {listing.university.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* ==================================================
              RIGHT SIDEBAR
          ================================================== */}

          <aside>
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              {/* =================================================
                  PRICE
              ================================================= */}

              <p className="text-3xl font-bold text-brand-blue sm:text-4xl">
                US${listing.monthlyRent}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                per month
              </p>

              {/* =================================================
                  ACTION BUTTONS
              ================================================= */}

              <div className="mt-6 space-y-3">

                <button
                  type="button"
                  className="w-full rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark"
                >
                  Contact Landlord
                </button>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <CalendarDays size={17} />

                  Schedule Viewing
                </button>

              </div>

              {/* Divider */}

              <div className="my-5 border-t border-slate-200" />

              {/* =================================================
                  QUICK DETAILS
              ================================================= */}

              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  University
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {listing.university.name}
                </p>
              </div>

              <div className="mt-5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Location
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {listing.city},{" "}
                  {listing.province}
                </p>
              </div>

              <div className="mt-5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Room Type
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {formatRoomType(
                    listing.roomType
                  )}
                </p>
              </div>

              <div className="mt-5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Property Type
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {formatPropertyType(
                    listing.propertyType
                  )}
                </p>
              </div>

              {/* =================================================
                  STATUS
              ================================================= */}

              <div className="mt-5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Status
                </p>

                <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                  <ShieldCheck size={15} />

                  <span>
                    Verified Listing
                  </span>
                </div>
              </div>

              {/* =================================================
                  LANDLORD
              ================================================= */}

              <div className="mt-6 border-t border-slate-200 pt-6">

                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Listed by
                </p>

                <div className="mt-3 flex items-center gap-3">

                  {/* Profile Photo */}

                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-2 ring-white shadow-sm">

                    {listing.landlord.landlordProfile?.profilePhotoUrl ? (
                      <img
                        src={
                          listing.landlord.landlordProfile
                            .profilePhotoUrl
                        }
                        alt={
                          listing.landlord.name ||
                          "Landlord"
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lg font-bold text-brand-blue">
                        {(listing.landlord.name || "L")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                  </div>

                  {/* Landlord Name */}

                  <div className="min-w-0">

                    <div className="flex items-center gap-1.5">

                      <p className="truncate font-semibold text-slate-900">
                        {listing.landlord.name ||
                          "Landlord"}
                      </p>

                      {listing.landlord.verified && (
                        <span
                          title="Verified landlord"
                          className="shrink-0 text-emerald-600"
                        >
                          ✓
                        </span>
                      )}

                    </div>

                    <p className="text-xs text-slate-500">
                      {listing.landlord._count.listings}{" "}
                      {listing.landlord._count.listings === 1
                        ? "active listing"
                        : "active listings"}
                    </p>

                  </div>

                </div>

                {/* View Landlord Profile */}

                <Link
                  href={`/landlords/${listing.landlord.id}`}
                  className="mt-4 flex w-full items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-brand-blue hover:bg-slate-50 hover:text-brand-blue"
                >
                  View Landlord Profile
                </Link>

              </div>

            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}

/* ============================================================
   HELPERS
============================================================ */

function formatPropertyType(
  propertyType: string
) {
  const labels: Record<string, string> = {
    HOUSE: "House",
    FLAT: "Flat",
    APARTMENT: "Apartment",
    TOWNHOUSE: "Townhouse",
    COTTAGE: "Cottage",
    ROOMING_HOUSE: "Rooming House",
    OTHER: "Other",
  };

  return (
    labels[propertyType] ||
    propertyType
  );
}

function formatRoomType(
  roomType: string
) {
  const labels: Record<string, string> = {
    PRIVATE: "Private Room",
    SHARED: "Shared Room",
    ENTIRE_PROPERTY:
      "Entire Property",
  };

  return (
    labels[roomType] ||
    roomType
  );
}

function formatGenderPreference(
  preference: string
) {
  const labels: Record<string, string> = {
    ANY: "Any Gender",
    MALE: "Male",
    FEMALE: "Female",
  };

  return (
    labels[preference] ||
    preference
  );
}