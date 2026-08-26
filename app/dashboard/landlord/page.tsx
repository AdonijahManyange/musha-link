import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function LandlordDashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (user.role !== "LANDLORD") {
    redirect("/dashboard");
  }

  // ============================================================
  // LANDLORD VERIFICATION STATUS
  // ============================================================

  const verification =
    await prisma.landlordVerification.findUnique({
      where: {
        landlordId: user.id,
      },
      select: {
        status: true,
      },
    });

  const verificationStatus =
    verification?.status ?? "NOT_STARTED";

  const isVerified =
    user.verified || verificationStatus === "APPROVED";

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="mb-10">
          <p className="text-sm font-medium text-brand-blue">
            Landlord Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Welcome back
            {user.name ? `, ${user.name}` : ""}! 👋
          </h1>

          <p className="mt-2 text-slate-600">
            Manage your properties and connect with students.
          </p>
        </div>

        {/* ================================================== */}
        {/* DASHBOARD CARDS */}
        {/* ================================================== */}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {/* ================================================== */}
          {/* MY LISTINGS */}
          {/* ================================================== */}

          <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              My Listings
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Create and manage your student accommodation listings.
            </p>

            <Link
              href="/dashboard/landlord/listings"
              className="mt-auto inline-block w-fit rounded-xl bg-brand-blue px-5 py-3 font-semibold text-white transition hover:bg-brand-blue-dark"
            >
              Manage Listings
            </Link>
          </div>

          {/* ================================================== */}
          {/* ADD PROPERTY */}
          {/* ================================================== */}

          <div
            className={`flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm ${
              isVerified
                ? "border-emerald-200"
                : "border-slate-200"
            }`}
          >
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Add Property
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                List a new property and make it available to students.
              </p>

              {isVerified ? (
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Verified
                </div>
              ) : (
                <div className="mt-3 text-xs font-medium text-orange-600">
                  Verification required before listing
                </div>
              )}
            </div>

            {isVerified ? (
              <Link
                href="/dashboard/landlord/listings/new"
                className="mt-auto inline-block w-fit rounded-xl bg-brand-blue px-5 py-3 font-semibold text-white transition hover:bg-brand-blue-dark"
              >
                Add Listing
              </Link>
            ) : (
              <Link
                href="/dashboard/landlord/verification"
                className="mt-auto inline-block w-fit rounded-xl border border-orange-300 bg-orange-50 px-3 py-3 font-semibold text-orange-700 transition hover:bg-orange-100"
              >
                Complete Verification
              </Link>
            )}
          </div>

          {/* ================================================== */}
          {/* VIEWING REQUESTS */}
          {/* ================================================== */}

          <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Viewing Requests
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Review students interested in viewing your properties.
            </p>

            <Link
              href="/dashboard/landlord/requests"
              className="mt-auto inline-block w-fit rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View Requests
            </Link>
          </div>

        </div>

        {/* ================================================== */}
        {/* ACCOUNT INFORMATION */}
        {/* ================================================== */}

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-sm font-semibold text-brand-blue">
                Account
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                Account Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Basic information associated with your MushaLink account.
              </p>
            </div>

            <Link
              href="/dashboard/landlord/profile"
              className="text-sm font-semibold text-brand-blue hover:underline"
            >
              Manage Profile →
            </Link>

          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-3">

            {/* Name */}

            <div>
              <p className="text-sm font-medium text-slate-500">
                Name
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {user.name || "Not provided"}
              </p>
            </div>

            {/* Email */}

            <div>
              <p className="text-sm font-medium text-slate-500">
                Email
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {user.email}
              </p>
            </div>

            {/* Account Type */}

            <div>
              <p className="text-sm font-medium text-slate-500">
                Account Type
              </p>

              <p className="mt-1 font-medium text-slate-900">
                Landlord
              </p>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}