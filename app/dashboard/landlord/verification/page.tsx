import TitleDeedUpload from "./TitleDeedUpload";
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

  const identityVerified =
    verification?.identityVerified &&
    verification?.livenessVerified &&
    verification?.faceMatchVerified;

  const titleDeedUploaded =
    Boolean(verification?.titleDeedUrl);

  const titleDeedApproved =
    verification?.titleDeedStatus === "APPROVED";

  const isVerified =
    verification?.status === "APPROVED" &&
    titleDeedApproved;

  const isPending =
    status === "PENDING" ||
    status === "ACTION_REQUIRED";

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
                  Your account is fully verified
                </h2>

                <p className="mt-1 text-sm text-emerald-800">
                  Your identity and property ownership have been verified by
                  MushaLink.
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
          <div className="mt-8 space-y-6">

            {/* ================================================== */}
            {/* STEP 1 — IDENTITY */}
            {/* ================================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    identityVerified
                      ? "bg-emerald-500 text-white"
                      : "bg-brand-blue text-white"
                  }`}
                >
                  {identityVerified ? "✓" : "1"}
                </div>

                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-slate-900">
                    Identity verification
                  </h2>

                  <p className="mt-1 text-sm text-slate-600">
                    Verify your government-issued ID, liveness, and face match
                    through our secure verification provider.
                  </p>

                  {identityVerified ? (
                    <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                      Identity verification completed ✓
                    </div>
                  ) : (
                    <div className="mt-5">
                      <StartVerificationButton />
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* ================================================== */}
            {/* STEP 2 — TITLE DEED */}
            {/* ================================================== */}

            {identityVerified && !titleDeedApproved && (
              <section>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-blue text-sm font-bold text-white">
                      2
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">
                        Property ownership
                      </h2>

                      <p className="mt-1 text-sm text-slate-600">
                        Upload the title deed for the property you intend to list
                        on MushaLink.
                      </p>
                    </div>
                  </div>
                </div>

                {titleDeedUploaded ? (
                  <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-6">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-3 w-3 rounded-full bg-amber-500" />

                      <div>
                        <h3 className="font-semibold text-slate-900">
                          Title deed submitted
                        </h3>

                        <p className="mt-1 text-sm text-slate-600">
                          Your title deed is waiting for MushaLink admin review.
                        </p>

                        {verification?.rejectionReason && (
                          <p className="mt-3 text-sm text-red-600">
                            Previous review:
                            {" "}
                            {verification.rejectionReason}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <TitleDeedUpload />
                )}
              </section>
            )}

            {/* ================================================== */}
            {/* STEP 3 — ADMIN REVIEW */}
            {/* ================================================== */}

            {identityVerified && titleDeedUploaded && !titleDeedApproved && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-600">
                    3
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      MushaLink review
                    </h2>

                    <p className="mt-1 text-sm text-slate-600">
                      Our team will review your title deed before your account
                      receives verified landlord status.
                    </p>

                    <div className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                      Verification is still in progress.
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
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