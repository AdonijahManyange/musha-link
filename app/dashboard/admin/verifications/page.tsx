import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import VerificationQueue from "../VerificationQueue";

export default async function VerificationCenterPage() {
  await requireAdmin();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Back */}
        <Link
          href="/dashboard/admin"
          className="inline-flex items-center text-sm font-medium text-slate-500 transition hover:text-brand-blue"
        >
          ← Back to Admin Dashboard
        </Link>

        {/* Header */}
        <div className="mt-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-brand-blue">
              Admin Dashboard
            </span>

            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              Verification Center
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
            Landlord Verification
          </h1>

          <p className="mt-2 max-w-2xl text-slate-600">
            Review landlords waiting for identity or property verification.
          </p>
        </div>

        {/* Verification Queue */}
        <section className="mt-10">
          <VerificationQueue />
        </section>
      </div>
    </main>
  );
}