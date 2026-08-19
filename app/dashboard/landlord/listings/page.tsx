import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function LandlordListingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (user.role !== "LANDLORD") {
    redirect("/dashboard");
  }

  const listings = await prisma.listing.findMany({
    where: {
      landlordId: user.id,
      isActive: true,
    },
    include: {
      university: {
        select: {
          name: true,
          city: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">

        {/* Header */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-brand-blue">
              Landlord Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              My Listings
            </h1>

            <p className="mt-2 text-slate-600">
              Create and manage your student accommodation listings.
            </p>
          </div>

          <Link
            href="/dashboard/landlord/listings/new"
            className="inline-flex w-fit rounded-xl bg-brand-blue px-5 py-3 font-semibold text-white transition hover:bg-brand-blue-dark"
          >
            + Add Property
          </Link>
        </div>

        {/* Listings */}

        {listings.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              No listings yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
              You haven't added any properties yet. Create your first listing
              to start connecting with students.
            </p>

            <Link
              href="/dashboard/landlord/listings/new"
              className="mt-6 inline-block rounded-xl bg-brand-blue px-5 py-3 font-semibold text-white transition hover:bg-brand-blue-dark"
            >
              Add Your First Property
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/dashboard/landlord/listings/${listing.id}`}
                className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md" 
              >
    
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {listing.title}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {listing.address}, {listing.city}, {listing.province},{" "}
                      {listing.country}
                    </p>
                  </div>

                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    Active
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      University
                    </p>

                    <p className="mt-1 font-medium text-slate-800">
                      {listing.university.name}
                    </p>

                    <p className="text-sm text-slate-500">
                      {listing.university.city}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Distance
                    </p>

                    <p className="mt-1 font-medium text-slate-800">
                      {listing.distanceToUniversityKm !== null
                        ? `${listing.distanceToUniversityKm.toFixed(1)} km`
                        : "Distance unavailable"}
                    </p>

                    <p className="text-sm text-slate-500">
                      from university
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Monthly Rent
                    </p>

                    <p className="mt-1 font-medium text-slate-800">
                      ${listing.monthlyRent}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Room
                    </p>

                    <p className="mt-1 font-medium text-slate-800">
                      {listing.roomType === "PRIVATE"
                        ? "Private Room"
                        : listing.roomType === "SHARED"
                        ? "Shared Room"
                        : "Entire Property"}
                    </p>
                  </div>

                </div>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="text-sm text-slate-600">
                    {listing.description}
                  </p>
                </div>

                <div className="mt-5">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {listing.genderPreference === "ANY"
                      ? "Any Gender"
                      : listing.genderPreference === "MALE"
                      ? "Male"
                      : "Female"}
                  </span>
                </div>
              </Link>
              
            ))}
          </div>
        )}

        {/* Back to Dashboard */}

        <div className="mt-6">
          <Link
            href="/dashboard/landlord"
            className="text-sm font-medium text-slate-600 hover:text-brand-blue"
          >
            ← Back to Dashboard
          </Link>
        </div>

      </div>
    </main>
  );
}