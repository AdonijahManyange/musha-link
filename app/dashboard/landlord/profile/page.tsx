import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function LandlordProfilePage() {
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

  const verificationStatus =
    verification?.status ?? "NOT_STARTED";

  const isVerified = verificationStatus === "APPROVED";
  const isPending = verificationStatus === "PENDING";
  const isRejected = verificationStatus === "REJECTED";

  // Shared theme classes
  const cardClass =
    "rounded-2xl border border-border bg-surface p-6 shadow-sm transition-colors duration-200";

  const headingClass =
    "text-text-primary";

  const descriptionClass =
    "text-text-secondary";

  // Verification colors adapt to light and dark modes.
  const verificationStyles = isVerified
    ? {
        panel:
          "border-green-200 bg-green-50 dark:border-green-400/30 dark:bg-green-950/30",
        icon:
          "bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300",
        title:
          "text-green-800 dark:text-green-300",
        description:
          "text-green-700 dark:text-green-200",
        badge:
          "text-green-700 dark:text-green-300",
      }
    : isRejected
    ? {
        panel:
          "border-red-200 bg-red-50 dark:border-red-400/30 dark:bg-red-950/30",
        icon:
          "bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300",
        title:
          "text-red-800 dark:text-red-300",
        description:
          "text-red-700 dark:text-red-200",
        badge:
          "text-red-700 dark:text-red-300",
      }
    : isPending
    ? {
        panel:
          "border-blue-200 bg-blue-50 dark:border-blue-400/30 dark:bg-blue-950/30",
        icon:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
        title:
          "text-blue-800 dark:text-blue-300",
        description:
          "text-blue-700 dark:text-blue-200",
        badge:
          "text-blue-700 dark:text-blue-300",
      }
    : {
        panel:
          "border-amber-200 bg-amber-50 dark:border-amber-400/30 dark:bg-amber-950/30",
        icon:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",
        title:
          "text-amber-800 dark:text-amber-300",
        description:
          "text-amber-700 dark:text-amber-200",
        badge:
          "text-amber-700 dark:text-amber-300",
      };

  return (
    <main className="min-h-screen bg-background px-6 py-12 transition-colors duration-200">
      <div className="mx-auto max-w-5xl">

        {/* ================================================== */}
        {/* BACK TO DASHBOARD */}
        {/* ================================================== */}

        <Link
          href="/dashboard/landlord"
          className="text-sm font-medium text-text-secondary transition hover:text-brand-blue dark:hover:text-blue-400"
        >
          ← Back to Dashboard
        </Link>

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-blue dark:text-blue-400">
            Landlord Account
          </p>

          <h1
            className={`mt-2 text-3xl font-bold ${headingClass}`}
          >
            Landlord Profile
          </h1>

          <p className={`mt-2 ${descriptionClass}`}>
            Manage your personal information and account verification.
          </p>
        </div>

        {/* ================================================== */}
        {/* VERIFICATION STATUS */}
        {/* ================================================== */}

        <section
          className={`mt-8 rounded-2xl border p-6 transition-colors duration-200 ${verificationStyles.panel}`}
        >
          <div className="flex flex-col items-start gap-4 sm:flex-row">

            {/* Status Icon */}

            <div
              className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold ${verificationStyles.icon}`}
            >
              {isVerified
                ? "✓"
                : isRejected
                ? "!"
                : isPending
                ? "…"
                : "!"}
            </div>

            {/* Status Information */}

            <div className="min-w-0 flex-1">
              <p
                className={`text-sm font-semibold uppercase tracking-wide ${verificationStyles.title}`}
              >
                Verification
              </p>

              {isVerified && (
                <>
                  <h2
                    className={`mt-1 text-xl font-bold ${verificationStyles.title}`}
                  >
                    Verified Landlord
                  </h2>

                  <p
                    className={`mt-1 text-sm leading-6 ${verificationStyles.description}`}
                  >
                    Your identity has been verified. You can create and
                    manage property listings.
                  </p>
                </>
              )}

              {isPending && (
                <>
                  <h2
                    className={`mt-1 text-xl font-bold ${verificationStyles.title}`}
                  >
                    Verification Under Review
                  </h2>

                  <p
                    className={`mt-1 text-sm leading-6 ${verificationStyles.description}`}
                  >
                    Your verification documents have been submitted and
                    are currently being reviewed.
                  </p>
                </>
              )}

              {isRejected && (
                <>
                  <h2
                    className={`mt-1 text-xl font-bold ${verificationStyles.title}`}
                  >
                    Action Required
                  </h2>

                  <p
                    className={`mt-1 text-sm leading-6 ${verificationStyles.description}`}
                  >
                    Your verification requires additional action.
                  </p>

                  {verification?.rejectionReason && (
                    <div className="mt-3 rounded-xl border border-red-200 bg-white/70 p-3 text-sm text-red-800 dark:border-red-400/20 dark:bg-red-950/40 dark:text-red-200">
                      <span className="font-semibold">
                        Reason:
                      </span>{" "}
                      {verification.rejectionReason}
                    </div>
                  )}
                </>
              )}

              {!verification && (
                <>
                  <h2
                    className={`mt-1 text-xl font-bold ${verificationStyles.title}`}
                  >
                    Verification Required
                  </h2>

                  <p
                    className={`mt-1 text-sm leading-6 ${verificationStyles.description}`}
                  >
                    Complete identity verification before creating
                    property listings.
                  </p>
                </>
              )}
            </div>

            {/* Verification Action */}

            {!isVerified && (
              <Link
                href="/dashboard/landlord/verification"
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark"
              >
                {isPending
                  ? "View Verification"
                  : "Complete Verification"}
              </Link>
            )}
          </div>
        </section>

        {/* ================================================== */}
        {/* PERSONAL INFORMATION */}
        {/* ================================================== */}

        <section className={`mt-8 ${cardClass}`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2
                className={`text-xl font-semibold ${headingClass}`}
              >
                Personal Information
              </h2>

              <p className={`mt-1 text-sm ${descriptionClass}`}>
                Information associated with your landlord account.
              </p>
            </div>

            <Link
              href="/dashboard/landlord/profile/edit"
              className="inline-flex w-fit items-center justify-center rounded-xl border border-border px-4 py-2 text-sm font-semibold text-text-primary transition hover:bg-surface-secondary"
            >
              Edit Profile
            </Link>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">

            {/* Name */}

            <div>
              <p className="text-sm font-medium text-text-secondary">
                Full Name
              </p>

              <p className="mt-1 font-medium text-text-primary">
                {user.name || "Not provided"}
              </p>
            </div>

            {/* Email */}

            <div>
              <p className="text-sm font-medium text-text-secondary">
                Email Address
              </p>

              <p className="mt-1 break-all font-medium text-text-primary">
                {user.email}
              </p>
            </div>

            {/* Account Type */}

            <div>
              <p className="text-sm font-medium text-text-secondary">
                Account Type
              </p>

              <p className="mt-1 font-medium text-text-primary">
                Landlord
              </p>
            </div>

            {/* Verification Status */}

            <div>
              <p className="text-sm font-medium text-text-secondary">
                Landlord Verification
              </p>

              <p
                className={`mt-1 font-semibold ${verificationStyles.badge}`}
              >
                {isVerified
                  ? "Verified"
                  : isPending
                  ? "Under Review"
                  : isRejected
                  ? "Action Required"
                  : "Verification Required"}
              </p>
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* LISTING ACCESS */}
        {/* ================================================== */}

        <section className={`mt-8 ${cardClass}`}>
          <h2
            className={`text-xl font-semibold ${headingClass}`}
          >
            Listing Access
          </h2>

          <p className={`mt-1 text-sm ${descriptionClass}`}>
            Your verification status determines whether you can add
            properties.
          </p>

          <div className="mt-5">
            {isVerified ? (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium leading-6 text-green-800 dark:border-green-400/30 dark:bg-green-950/30 dark:text-green-300">
                ✓ Your account is verified. You can create property
                listings.
              </div>
            ) : (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium leading-6 text-amber-800 dark:border-amber-400/30 dark:bg-amber-950/30 dark:text-amber-300">
                ⚠ You must complete landlord verification before you can
                create a property listing.
              </div>
            )}
          </div>
        </section>

        {/* ================================================== */}
        {/* PRIVACY NOTICE */}
        {/* ================================================== */}

        <div className={`mt-8 ${cardClass}`}>
          <p className="text-sm leading-6 text-text-secondary">
            <span aria-hidden="true">🔒 </span>
            Your personal information and verification documents are
            private and are not displayed publicly to students.
          </p>
        </div>
      </div>
    </main>
  );
}