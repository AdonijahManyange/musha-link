import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
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

  const [unreadMessageCount, pendingViewingCount, acceptedViewingCount] =
    await Promise.all([
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
            Welcome{user.name ? `, ${user.name}` : ""}! 👋
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

          <div
            className={`flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm ${
              isVerified ? "border-slate-200" : "border-orange-200"
            }`}
          >
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                My Listings
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                Create and manage your student accommodation listings.
              </p>

              {!isVerified && (
                <div className="mt-4 rounded-xl bg-orange-50 p-3">
                  <p className="text-sm font-semibold text-orange-800">
                    Verification required
                  </p>

                  <p className="mt-1 text-xs text-orange-700">
                    Complete landlord verification before you can manage
                    listings.
                  </p>
                </div>
              )}
            </div>

            {isVerified ? (
              <Link
                href="/dashboard/landlord/listings"
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-brand-blue px-5 py-3 font-semibold text-white transition hover:bg-brand-blue-dark"
              >
                Manage Listings
                <ArrowRight size={17} />
              </Link>
            ) : (
              <Link
                href="/dashboard/landlord/verification"
                className="mt-6 inline-block w-fit rounded-xl border border-orange-300 bg-orange-50 px-5 py-3 font-semibold text-orange-700 transition hover:bg-orange-100"
              >
                Complete Verification
              </Link>
            )}
          </div>

          {/* ================================================== */}
          {/* ADD PROPERTY */}
          {/* ================================================== */}

          <div
            className={`flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm ${
              isVerified ? "border-emerald-200" : "border-orange-200"
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
                <div className="mt-4 rounded-xl bg-orange-50 p-3">
                  <p className="text-sm font-semibold text-orange-800">
                    Verification required
                  </p>

                  <p className="mt-1 text-xs text-orange-700">
                    Complete landlord verification before you can create a
                    listing.
                  </p>
                </div>
              )}
            </div>

            {isVerified ? (
              <Link
                href="/dashboard/landlord/listings/new"
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-brand-blue px-5 py-3 font-semibold text-white transition hover:bg-brand-blue-dark"
              >
                Add Listing
                <ArrowRight size={17} />
              </Link>
            ) : (
              <Link
                href="/dashboard/landlord/verification"
                className="mt-6 inline-block w-fit rounded-xl border border-orange-300 bg-orange-50 px-5 py-3 font-semibold text-orange-700 transition hover:bg-orange-100"
              >
                Complete Verification
              </Link>
            )}
          </div>

          {/* ================================================== */}
          {/* MESSAGES */}
          {/* ================================================== */}

          <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Messages
                </h2>

                {unreadMessageCount > 0 && (
                  <span className="flex min-w-6 items-center justify-center rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                    {unreadMessageCount > 99 ? "99+" : unreadMessageCount}
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm text-slate-600">
                View and respond to students interested in your properties.
              </p>

              {unreadMessageCount > 0 ? (
                <div className="mt-4 rounded-xl bg-red-50 p-3">
                  <p className="text-sm font-semibold text-red-800">
                    {unreadMessageCount === 1
                      ? "1 unread message"
                      : `${unreadMessageCount} unread messages`}
                  </p>

                  <p className="mt-1 text-xs text-red-700">
                    You have student messages waiting for a response.
                  </p>
                </div>
              ) : (
                <div className="mt-4 rounded-xl bg-slate-50 p-3">
                  <p className="text-sm font-medium text-slate-700">
                    No unread messages
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    New student conversations will appear here.
                  </p>
                </div>
              )}
            </div>

            <Link
              href="/messages"
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-brand-blue px-5 py-3 font-semibold text-white transition hover:bg-brand-blue-dark"
            >
              View Messages
              <ArrowRight size={17} />
            </Link>
          </div>

          {/* ================================================== */}
          {/* VIEWING REQUESTS — NEW */}
          {/* ================================================== */}

          <Link
            href="/dashboard/viewing-requests"
            className={`group flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
              pendingViewingCount > 0
                ? "border-amber-200 hover:border-amber-300"
                : "border-slate-200 hover:border-blue-200"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Viewing Requests
              </h2>

              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  pendingViewingCount > 0
                    ? "bg-amber-100 text-amber-700"
                    : "bg-blue-50 text-brand-blue"
                }`}
              >
                <CalendarDays size={22} />
              </div>
            </div>

            <p className="mt-2 text-sm text-slate-600">
              Review student requests to visit your properties and manage
              upcoming viewings.
            </p>

            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">
                    Pending requests
                  </p>

                  <p
                    className={`mt-1 text-3xl font-bold ${
                      pendingViewingCount > 0
                        ? "text-amber-700"
                        : "text-slate-900"
                    }`}
                  >
                    {pendingViewingCount}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-slate-500">Accepted</p>

                  <p className="mt-1 text-xl font-semibold text-green-700">
                    {acceptedViewingCount}
                  </p>
                </div>
              </div>

              {pendingViewingCount > 0 && (
                <p className="mt-3 flex items-center gap-2 text-sm font-medium text-amber-800">
                  <Clock size={16} />
                  {pendingViewingCount === 1
                    ? "You have a request awaiting your response."
                    : "You have requests awaiting your response."}
                </p>
              )}

              {pendingViewingCount === 0 && (
                <p className="mt-3 text-sm text-slate-500">
                  You&apos;re all caught up on pending requests.
                </p>
              )}
            </div>

            <div className="mt-auto flex items-center justify-between pt-5">
              <span className="font-semibold text-brand-blue">
                Manage Viewings
              </span>

              <ArrowRight
                size={19}
                className="text-brand-blue transition-transform group-hover:translate-x-1"
              />
            </div>
          </Link>
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
              <p className="text-sm font-medium text-slate-500">Name</p>

              <p className="mt-1 font-medium text-slate-900">
                {user.name || "Not provided"}
              </p>
            </div>

            {/* Email */}

            <div>
              <p className="text-sm font-medium text-slate-500">Email</p>

              <p className="mt-1 break-all font-medium text-slate-900">
                {user.email}
              </p>
            </div>

            {/* Account Type */}

            <div>
              <p className="text-sm font-medium text-slate-500">
                Account Type
              </p>

              <p className="mt-1 font-medium text-slate-900">Landlord</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}