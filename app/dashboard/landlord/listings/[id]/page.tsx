import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type ListingPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ListingPage({
  params,
}: ListingPageProps) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: {
      id,
    },
    include: {
      university: true,
    },
  });

  if (!listing) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">

        {/* Back */}

        <Link
          href="/dashboard/landlord/listings"
          className="text-sm font-medium text-slate-600 hover:text-brand-blue"
        >
          ← Back to My Listings
        </Link>

        {/* Header */}

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

          <div>
            <p className="text-sm font-medium text-brand-blue">
              Landlord Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              {listing.title}
            </h1>

            <p className="mt-2 text-slate-600">
              {listing.address}, {listing.city}, {listing.province},{" "}
              {listing.country}
            </p>
          </div>

          {/* Status */}

          <span
            className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-semibold ${
              listing.isActive
                ? "bg-green-50 text-green-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {listing.isActive ? "Active" : "Inactive"}
          </span>

        </div>

        {/* Main Card */}

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-slate-900">
            Property Details
          </h2>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

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
                {listing.distanceToUniversityKm !== null
                  ? `${listing.distanceToUniversityKm.toFixed(1)} km`
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
                {formatRoomType(listing.roomType)}
              </p>
            </div>

          </div>

          {/* Gender */}

          <div className="mt-6 border-t border-slate-100 pt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Gender Preference
            </p>

            <p className="mt-2 font-semibold text-slate-900">
              {formatGenderPreference(listing.genderPreference)}
            </p>
          </div>

        </section>

        {/* Description */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-slate-900">
            Description
          </h2>

          <p className="mt-4 whitespace-pre-line leading-7 text-slate-600">
            {listing.description}
          </p>

        </section>

        {/* Location */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-slate-900">
            Location
          </h2>

          <p className="mt-3 text-slate-600">
            {listing.address}, {listing.city}, {listing.province},{" "}
            {listing.country}
          </p>

          {listing.latitude !== null &&
            listing.longitude !== null && (
              <p className="mt-2 text-sm text-slate-400">
                Coordinates: {listing.latitude.toFixed(6)},{" "}
                {listing.longitude.toFixed(6)}
              </p>
            )}

        </section>

        {/* Actions */}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">

          <Link
            href={`/dashboard/landlord/listings/${listing.id}/edit`}
            className="rounded-xl border border-slate-300 px-6 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Edit Listing
          </Link>

          <Link
            href="/dashboard/landlord/listings"
            className="rounded-xl bg-brand-blue px-6 py-3 text-center font-semibold text-white transition hover:bg-brand-blue-dark"
          >
            Back to Listings
          </Link>

        </div>

      </div>
    </main>
  );
}

/* Helpers */

function formatRoomType(roomType: string) {
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

function formatGenderPreference(preference: string) {
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