import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const admin = await requireAdmin();

  const pendingVerificationCount =
    await prisma.landlordVerification.count({
      where: {
        status: "PENDING",
      },
    });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-brand-blue">
              Admin Dashboard
            </span>

            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              Administration
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
            Welcome, {admin.name || "Admin"}
          </h1>

          <p className="mt-2 text-slate-600">
            Manage MushaLink verification and platform activity from one place.
          </p>
        </div>

        {/* Admin Tools */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900">
            Admin Tools
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Review and manage important MushaLink activity.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-3">

            {/* Pending Verifications */}
            <Link
              href="/dashboard/admin/verifications"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl text-brand-blue">
                  ✓
                </div>

                <span className="text-xl text-slate-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-brand-blue">
                  →
                </span>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-bold text-slate-900">
                  Pending Verifications
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Review landlords waiting for identity or property
                  verification.
                </p>
              </div>

              <div className="mt-6 flex items-end justify-between border-t border-slate-100 pt-5">
                <div>
                  <p className="text-3xl font-bold text-slate-900">
                    {pendingVerificationCount}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {pendingVerificationCount === 1
                      ? "request awaiting review"
                      : "requests awaiting review"}
                  </p>
                </div>

                <span className="text-sm font-semibold text-brand-blue">
                  Review requests →
                </span>
              </div>
            </Link>

            {/* Listings */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl">
                  🏠
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                  Coming soon
                </span>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-bold text-slate-900">
                  Listings
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Manage property listings, approvals, and platform
                  activity.
                </p>
              </div>
            </div>

            {/* Users */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl">
                  👥
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                  Coming soon
                </span>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-bold text-slate-900">
                  Users
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Manage student and landlord accounts across
                  MushaLink.
                </p>
              </div>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}