import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import StartVerificationButton from "@/components/StartVerificationButton";

export default async function LandlordVerificationPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (user.role !== "LANDLORD") {
    redirect("/dashboard");
  }

  const verification =
    await prisma.landlordVerification.findUnique({
      where: {
        landlordId: user.id,
      },
    });

  const status = verification?.status ?? "NOT_STARTED";

  const isVerified = status === "APPROVED";
  const isPending =
    status === "PENDING" || status === "ACTION_REQUIRED";

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">

        {/* Back */}
        <Link
          href="/dashboard/landlord"
          className="inline-flex items-center text-sm font-medium text-slate-600 transition hover:text-brand-blue"
        >
          ← Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-blue">
            Account Verification
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Landlord verification
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Verification helps students know that the landlords and
            properties listed on MushaLink are legitimate.
          </p>
        </div>

        {/* ================================================== */}
        {/* VERIFIED */}
        {/* ================================================== */}

        {isVerified ? (
          <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                ✓
              </div>

              <div>
                <h2 className="font-semibold text-emerald-900">
                  Your account is verified
                </h2>

                <p className="mt-1 text-sm text-emerald-800">
                  Your identity has been successfully verified. You can now
                  create and manage property listings on MushaLink.
                </p>
              </div>
            </div>

            <div className="mt-5">
              <Link
                href="/dashboard/landlord/listings/new"
                className="inline-flex rounded-xl bg-brand-blue px-5 py-3 font-semibold text-white transition hover:bg-brand-blue-dark"
              >
                Add Listing
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* ================================================== */}
            {/* PENDING */}
            {/* ================================================== */}

            {isPending && (
              <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-3 w-3 rounded-full bg-amber-500" />

                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Verification in progress
                    </h2>

                    <p className="mt-1 text-sm text-slate-600">
                      Your verification is currently being processed.
                      We'll update your account once the review is complete.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================== */}
            {/* NOT VERIFIED */}
            {/* ================================================== */}

            {!isPending && (
              <>
                <div className="mt-8 rounded-2xl border border-orange-200 bg-orange-50 p-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-3 w-3 rounded-full bg-orange-500" />

                    <div>
                      <h2 className="font-semibold text-slate-900">
                        Verification required
                      </h2>

                      <p className="mt-1 text-sm text-slate-600">
                        Complete identity verification before creating
                        property listings.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-slate-900">
                    What you'll need
                  </h2>

                  <div className="mt-5 space-y-4">

                    <div className="rounded-xl bg-slate-50 p-4">
                      <h3 className="font-semibold text-slate-900">
                        1. Government-issued ID
                      </h3>

                      <p className="mt-1 text-sm text-slate-600">
                        Upload a clear copy of your national ID, passport,
                        or driver's license.
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <h3 className="font-semibold text-slate-900">
                        2. Identity verification
                      </h3>

                      <p className="mt-1 text-sm text-slate-600">
                        Complete the secure identity verification process.
                      </p>
                    </div>

                  </div>
                </div>

                {/* Start Verification */}
                <div className="mt-8 flex justify-end">
                  <StartVerificationButton />
                </div>
              </>
            )}
          </>
        )}

        {/* Privacy Notice */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-600">
            🔒 Your verification information is private and will only be used
            for account verification. It will not be publicly displayed on
            MushaLink.
          </p>
        </div>

      </div>
    </main>
  );
}