import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Home,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

type LandlordPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LandlordProfilePage({
  params,
}: LandlordPageProps) {
  const { id } = await params;

  const landlord = await prisma.user.findUnique({
    where: {
      id,
    },

    select: {
      id: true,
      name: true,
      email: true,
      verified: true,
      createdAt: true,

      landlordProfile: {
        select: {
          profilePhotoUrl: true,
          coverPhotoUrl: true,
          bio: true,
          phone: true,
          address: true,
          city: true,
          province: true,
          country: true,
        },
      },

      listings: {
        where: {
          status: "PUBLISHED",
          isActive: true,
        },

        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
          title: true,
          address: true,
          city: true,
          province: true,
          country: true,
          monthlyRent: true,
          roomType: true,
          propertyType: true,
          distanceToUniversityKm: true,

          university: {
            select: {
              name: true,
            },
          },

          photos: {
            orderBy: {
              sortOrder: "asc",
            },

            take: 1,

            select: {
              id: true,
              url: true,
            },
          },
        },
      },
    },
  });

  if (!landlord) {
    notFound();
  }

  const profile = landlord.landlordProfile;

  const landlordName =
    landlord.name?.trim() || "Landlord";

  /*
   * PUBLIC LOCATION
   *
   * We intentionally do NOT expose the landlord's
   * street address / house number publicly.
   *
   * Only city, province and country are shown.
   */
  const locationParts = [
    profile?.city,
    profile?.province,
    profile?.country,
  ].filter(Boolean);

  const location =
    locationParts.length > 0
      ? locationParts.join(", ")
      : "Location not provided";

  const memberSince = new Intl.DateTimeFormat(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  ).format(landlord.createdAt);

  const listingCount =
    landlord.listings.length;

  const initials = landlordName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase()
    )
    .join("");

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">

        {/* =====================================================
            BACK
        ===================================================== */}

        <div className="mb-6">
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-brand-blue"
          >
            <ArrowLeft size={16} />
            Back to Listings
          </Link>
        </div>

        {/* =====================================================
            PROFILE HEADER
        ===================================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* =================================================
              COVER PHOTO
          ================================================= */}

          <div className="aspect-[5/2] w-full bg-brand-blue">
            {profile?.coverPhotoUrl ? (
              <img
                src={profile.coverPhotoUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-brand-blue" />
            )}
          </div>

          <div className="px-5 pt-16 pb-6 sm:px-8 sm:pt-20 sm:pb-8">

            {/* =================================================
                PROFILE PHOTO + NAME
            ================================================= */}

            <div className="-mt-16 flex flex-col gap-5 sm:-mt-20 sm:flex-row sm:items-end sm:justify-between">

              <div className="flex items-end gap-4">

                {/* Profile Photo */}

                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-md sm:h-32 sm:w-32">

                  {profile?.profilePhotoUrl ? (
                    <img
                      src={profile.profilePhotoUrl}
                      alt={landlordName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-brand-blue sm:text-4xl">
                      {initials || "L"}
                    </div>
                  )}

                </div>

                {/* Name + Verification */}

                <div className="pb-1 sm:pb-2">

                  <div className="flex flex-wrap items-center gap-2">

                    <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                      {landlordName}
                    </h1>

                    {landlord.verified && (
                      <span
                        title="Verified landlord"
                        className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                      >
                        <BadgeCheck size={14} />
                        Verified Landlord
                      </span>
                    )}

                  </div>

                  {/* Public Location */}

                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <MapPin size={16} />

                    <span>
                      {location}
                    </span>
                  </div>

                </div>

              </div>

              {/* Contact */}

              <div className="sm:pb-2">

                <a
                  href={`mailto:${landlord.email}`}
                  className="flex w-full items-center justify-center rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark sm:w-auto"
                >
                  Contact Landlord
                </a>

              </div>

            </div>
          </div>
        </section>

        {/* =====================================================
            PROFILE CONTENT
        ===================================================== */}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">

          {/* ===================================================
              LEFT CONTENT
          =================================================== */}

          <div>

            {/* =================================================
                ABOUT
            ================================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

              <h2 className="text-xl font-bold text-slate-900">
                About the Landlord
              </h2>

              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                {profile?.bio ||
                  `${landlordName} is a landlord on Musha helping students find accommodation near their university.`}
              </p>

            </section>

            {/* =================================================
                PROPERTIES
            ================================================= */}

            <section className="mt-8">

              <div className="flex items-end justify-between gap-4">

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Properties by {landlordName}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {listingCount}{" "}
                    {listingCount === 1
                      ? "active property"
                      : "active properties"}
                  </p>
                </div>

              </div>

              {/* No Listings */}

              {listingCount === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">

                  <Home
                    size={40}
                    className="mx-auto text-slate-300"
                  />

                  <h3 className="mt-4 font-semibold text-slate-900">
                    No active properties
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    This landlord currently has no
                    published properties.
                  </p>

                </div>
              ) : (
                <div className="mt-5 grid gap-5 sm:grid-cols-2">

                  {landlord.listings.map(
                    (listing) => {

                      const photo =
                        listing.photos[0];

                      return (
                        <Link
                          key={listing.id}
                          href={`/listings/${listing.id}`}
                          className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-brand-blue hover:shadow-md"
                        >

                          {/* =================================================
                              LISTING PHOTO
                          ================================================= */}

                          <div className="relative h-48 overflow-hidden bg-slate-200">

                            {photo ? (
                              <img
                                src={photo.url}
                                alt={listing.title}
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-slate-400">
                                <Home size={42} />
                              </div>
                            )}

                            {/* Price */}

                            <div className="absolute bottom-3 left-3 rounded-lg bg-white px-3 py-1.5 shadow-sm">

                              <span className="text-sm font-bold text-brand-blue">
                                US$
                                {
                                  listing.monthlyRent
                                }
                              </span>

                              <span className="ml-1 text-xs text-slate-500">
                                / month
                              </span>

                            </div>

                          </div>

                          {/* =================================================
                              LISTING DETAILS
                          ================================================= */}

                          <div className="p-5">

                            <h3 className="truncate font-bold text-slate-900">
                              {listing.title}
                            </h3>

                            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">

                              <MapPin size={15} />

                              <span className="truncate">
                                {listing.city},{" "}
                                {listing.province}
                              </span>

                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">

                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                {formatRoomType(
                                  listing.roomType
                                )}
                              </span>

                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                {formatPropertyType(
                                  listing.propertyType
                                )}
                              </span>

                            </div>

                            <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">

                              <span className="font-medium">
                                {
                                  listing
                                    .university
                                    .name
                                }
                              </span>

                            </div>

                            {listing.distanceToUniversityKm !==
                              null && (
                              <p className="mt-1 text-xs text-slate-400">
                                {listing.distanceToUniversityKm.toFixed(
                                  1
                                )}{" "}
                                km from university
                              </p>
                            )}

                          </div>

                        </Link>
                      );
                    }
                  )}

                </div>
              )}

            </section>

          </div>

          {/* ===================================================
              RIGHT SIDEBAR
          =================================================== */}

          <aside>

            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="text-lg font-bold text-slate-900">
                Landlord Information
              </h2>

              {/* =================================================
                  VERIFICATION
              ================================================= */}

              <div className="mt-5 rounded-xl bg-emerald-50 p-4">

                <div className="flex items-start gap-3">

                  <ShieldCheck
                    size={21}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />

                  <div>

                    <p className="font-semibold text-emerald-800">
                      {landlord.verified
                        ? "Verified Landlord"
                        : "Landlord Profile"}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-emerald-700">
                      {landlord.verified
                        ? "This landlord has completed Musha's verification process."
                        : "This landlord has a profile on Musha."}
                    </p>

                  </div>

                </div>

              </div>

              {/* =================================================
                  LOCATION
              ================================================= */}

              <div className="mt-6">

                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Location
                </p>

                <div className="mt-2 flex items-start gap-2">

                  <MapPin
                    size={17}
                    className="mt-0.5 shrink-0 text-brand-blue"
                  />

                  <p className="text-sm font-semibold text-slate-900">
                    {location}
                  </p>

                </div>

              </div>

              {/* =================================================
                  MEMBER SINCE
              ================================================= */}

              <div className="mt-6">

                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Member Since
                </p>

                <div className="mt-2 flex items-center gap-2">

                  <CalendarDays
                    size={17}
                    className="text-brand-blue"
                  />

                  <p className="text-sm font-semibold text-slate-900">
                    {memberSince}
                  </p>

                </div>

              </div>

              {/* =================================================
                  ACTIVE PROPERTIES
              ================================================= */}

              <div className="mt-6">

                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Active Properties
                </p>

                <div className="mt-2 flex items-center gap-2">

                  <Home
                    size={17}
                    className="text-brand-blue"
                  />

                  <p className="text-sm font-semibold text-slate-900">
                    {listingCount}{" "}
                    {listingCount === 1
                      ? "property"
                      : "properties"}
                  </p>

                </div>

              </div>

              <div className="my-6 border-t border-slate-200" />

              {/* =================================================
                  CONTACT
              ================================================= */}

              <a
                href={`mailto:${landlord.email}`}
                className="flex w-full items-center justify-center rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark"
              >
                Contact {landlordName}
              </a>

              <p className="mt-3 text-center text-xs leading-5 text-slate-400">
                Contact information is provided
                through Musha.
              </p>

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
  const labels: Record<
    string,
    string
  > = {
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
  const labels: Record<
    string,
    string
  > = {
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