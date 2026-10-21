import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  ArrowRight,
} from "lucide-react";

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

  const verification = await prisma.landlordVerification.findUnique({
    where: {
      landlordId: user.id,
    },
    select: {
      status: true,
    },
  });

  const verificationStatus = verification?.status ?? "NOT_STARTED";
  const isVerified = verificationStatus === "APPROVED";

  // ============================================================
  // DASHBOARD COUNTS
  // ============================================================

  const [
    unreadMessageCount,
    pendingViewingCount,
    acceptedViewingCount,
  ] = await Promise.all([
    prisma.message.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    }),

    prisma.viewingRequest.count({
      where: {
        landlordId: user.id,
        status: "PENDING",
      },
    }),

    prisma.viewingRequest.count({
      where: {
        landlordId: user.id,
        status: "ACCEPTED",
      },
    }),
  ]);

  // ============================================================
  // SHARED THEME CLASSES
  // ============================================================

  const cardClass =
    "flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-sm transition-colors duration-200";

  const headingClass =
    "text-lg font-semibold text-text-primary";

  const descriptionClass =
    "mt-2 text-sm leading-6 text-text-secondary";

  const primaryButtonClass =
    "mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-brand-blue px-5 py-3 font-semibold text-white transition hover:bg-brand-blue-dark";

  const secondaryPanelClass =
    "rounded-xl bg-surface-secondary p-4";

  return (
    <main className="min-h-screen bg-background px-6 py-12 transition-colors duration-200">
      <div className="mx-auto max-w-6xl">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="mb-10">
          <p className="text-sm font-medium text-brand-blue dark:text-blue-400">
            Landlord Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold text-text-primary">
            Welcome{user.name ? `, ${user.name}` : ""}! 👋
          </h1>

          <p className="mt-2 text-text-secondary">
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

          <div
            className={`${cardClass} ${
              isVerified
                ? ""
                : "border-orange-200 dark:border-orange-400/40"
            }`}
          >
            <div>
              <h2 className={headingClass}>
                My Listings
              </h2>

              <p className={descriptionClass}>
                Create and manage your student accommodation listings.
              </p>

              {!isVerified && (
                <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50 p-3 dark:border-orange-400/30 dark:bg-orange-950/30">
                  <p className="text-sm font-semibold text-orange-800 dark:text-orange-300">
                    Verification required
                  </p>

                  <p className="mt-1 text-xs leading-5 text-orange-700 dark:text-orange-200">
                    Complete landlord verification before you can manage
                    listings.
                  </p>
                </div>
              )}
            </div>

            {isVerified ? (
              <Link
                href="/dashboard/landlord/listings"
                className={primaryButtonClass}
              >
                Manage Listings
                <ArrowRight size={17} />
              </Link>
            ) : (
              <Link
                href="/dashboard/landlord/verification"
                className="mt-6 inline-block w-fit rounded-xl border border-orange-300 bg-orange-50 px-5 py-3 font-semibold text-orange-800 transition hover:bg-orange-100 dark:border-orange-400/40 dark:bg-orange-950/30 dark:text-orange-300 dark:hover:bg-orange-950/50"
              >
                Complete Verification
              </Link>
            )}
          </div>

          {/* ================================================== */}
          {/* ADD PROPERTY */}
          {/* ================================================== */}

          <div
            className={`${cardClass} ${
              isVerified
                ? "border-emerald-200 dark:border-emerald-400/40"
                : "border-orange-200 dark:border-orange-400/40"
            }`}
          >
            <div>
              <h2 className={headingClass}>
                Add Property
              </h2>

              <p className={descriptionClass}>
                List a new property and make it available to students.
              </p>

              {isVerified ? (
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Verified
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50 p-3 dark:border-orange-400/30 dark:bg-orange-950/30">
                  <p className="text-sm font-semibold text-orange-800 dark:text-orange-300">
                    Verification required
                  </p>

                  <p className="mt-1 text-xs leading-5 text-orange-700 dark:text-orange-200">
                    Complete landlord verification before you can create a
                    listing.
                  </p>
                </div>
              )}
            </div>

            {isVerified ? (
              <Link
                href="/dashboard/landlord/listings/new"
                className={primaryButtonClass}
              >
                Add Listing
                <ArrowRight size={17} />
              </Link>
            ) : (
              <Link
                href="/dashboard/landlord/verification"
                className="mt-6 inline-block w-fit rounded-xl border border-orange-300 bg-orange-50 px-5 py-3 font-semibold text-orange-800 transition hover:bg-orange-100 dark:border-orange-400/40 dark:bg-orange-950/30 dark:text-orange-300 dark:hover:bg-orange-950/50"
              >
                Complete Verification
              </Link>
            )}
          </div>

          {/* ================================================== */}
          {/* MESSAGES */}
          {/* ================================================== */}

          <div className={cardClass}>
            <div>
              <div className="flex items-start justify-between gap-4">
                <h2 className={headingClass}>
                  Messages
                </h2>

                {unreadMessageCount > 0 && (
                  <span className="flex min-w-6 items-center justify-center rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                    {unreadMessageCount > 99
                      ? "99+"
                      : unreadMessageCount}
                  </span>
                )}
              </div>

              <p className={descriptionClass}>
                View and respond to students interested in your properties.
              </p>

              {unreadMessageCount > 0 ? (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-400/30 dark:bg-red-950/30">
                  <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                    {unreadMessageCount === 1
                      ? "1 unread message"
                      : `${unreadMessageCount} unread messages`}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-700 dark:text-red-200">
                    You have student messages waiting for a response.
                  </p>
                </div>
              ) : (
                <div className={`mt-4 ${secondaryPanelClass}`}>
                  <p className="text-sm font-medium text-text-primary">
                    No unread messages
                  </p>

                  <p className="mt-1 text-xs leading-5 text-text-secondary">
                    New student conversations will appear here.
                  </p>
                </div>
              )}
            </div>

            <Link
              href="/messages"
              className={primaryButtonClass}
            >
              View Messages
              <ArrowRight size={17} />
            </Link>
          </div>

          {/* ================================================== */}
          {/* VIEWING REQUESTS */}
          {/* ================================================== */}

          <Link
            href="/dashboard/viewing-requests"
            className={`group flex h-full flex-col rounded-2xl border bg-surface p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
              pendingViewingCount > 0
                ? "border-amber-300 hover:border-amber-400 dark:border-amber-400/50 dark:hover:border-amber-300"
                : "border-border hover:border-brand-blue/40"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className={headingClass}>
                Viewing Requests
              </h2>

              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  pendingViewingCount > 0
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                    : "bg-blue-50 text-brand-blue dark:bg-blue-950/40 dark:text-blue-300"
                }`}
              >
                <CalendarDays size={22} />
              </div>
            </div>

            <p className={descriptionClass}>
              Review student requests to visit your properties and manage
              upcoming viewings.
            </p>

            <div className={`mt-5 ${secondaryPanelClass}`}>
              <div className="flex items-center justify-between gap-3">

                {/* Pending count */}

                <div>
                  <p className="text-sm text-text-secondary">
                    Pending requests
                  </p>

                  <p
                    className={`mt-1 text-3xl font-bold ${
                      pendingViewingCount > 0
                        ? "text-amber-700 dark:text-amber-400"
                        : "text-text-primary"
                    }`}
                  >
                    {pendingViewingCount}
                  </p>
                </div>

                {/* Accepted count */}

                <div className="text-right">
                  <p className="text-sm text-text-secondary">
                    Accepted
                  </p>

                  <p className="mt-1 text-xl font-semibold text-green-700 dark:text-green-400">
                    {acceptedViewingCount}
                  </p>
                </div>
              </div>

              {pendingViewingCount > 0 && (
                <p className="mt-3 flex items-start gap-2 text-sm font-medium text-amber-800 dark:text-amber-400">
                  <Clock size={16} className="mt-0.5 shrink-0" />

                  <span>
                    {pendingViewingCount === 1
                      ? "You have a request awaiting your response."
                      : "You have requests awaiting your response."}
                  </span>
                </p>
              )}

              {pendingViewingCount === 0 && (
                <p className="mt-3 text-sm text-text-secondary">
                  You&apos;re all caught up on pending requests.
                </p>
              )}
            </div>

            <div className="mt-auto flex items-center justify-between pt-5">
              <span className="font-semibold text-brand-blue dark:text-blue-400">
                Manage Viewings
              </span>

              <ArrowRight
                size={19}
                className="text-brand-blue transition-transform group-hover:translate-x-1 dark:text-blue-400"
              />
            </div>
          </Link>
        </div>

        {/* ================================================== */}
        {/* ACCOUNT INFORMATION */}
        {/* ================================================== */}

        <div className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-sm transition-colors duration-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-brand-blue dark:text-blue-400">
                Account
              </p>

              <h2 className="mt-1 text-lg font-semibold text-text-primary">
                Account Information
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                Basic information associated with your MushaLink account.
              </p>
            </div>

            <Link
              href="/dashboard/landlord/profile"
              className="text-sm font-semibold text-brand-blue hover:underline dark:text-blue-400"
            >
              Manage Profile →
            </Link>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-3">

            {/* Name */}

            <div>
              <p className="text-sm font-medium text-text-secondary">
                Name
              </p>

              <p className="mt-1 font-medium text-text-primary">
                {user.name || "Not provided"}
              </p>
            </div>

            {/* Email */}

            <div>
              <p className="text-sm font-medium text-text-secondary">
                Email
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
          </div>
        </div>

      </div>
    </main>
  );
}