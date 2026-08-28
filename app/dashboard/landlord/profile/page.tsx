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

  const isVerified =
    verificationStatus === "APPROVED";

  const isPending =
    verificationStatus === "PENDING";

  const isRejected =
    verificationStatus === "REJECTED";

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">

        {/* Back */}

        <Link
          href="/dashboard/landlord"
          className="text-sm font-medium text-slate-600 hover:text-brand-blue"
        >
          ← Back to Dashboard
        </Link>

        {/* Header */}

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-blue">
            Landlord Account
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Landlord Profile
          </h1>

          <p className="mt-2 text-slate-600">
            Manage your personal information and account verification.
          </p>
        </div>

        {/* ================================================== */}
        {/* VERIFICATION STATUS */}
        {/* ================================================== */}

        <section
          className={`mt-8 rounded-2xl border p-6 ${
            isVerified
              ? "border-green-200 bg-green-50"
              : isRejected
              ? "border-red-200 bg-red-50"
              : isPending
              ? "border-blue-200 bg-blue-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <div className="flex items-start gap-4">

            <div
              className={`mt-1 flex h-10 w-10 items-center justify-center rounded-full ${
                isVerified
                  ? "bg-green-100 text-green-700"
                  : isRejected
                  ? "bg-red-100 text-red-700"
                  : isPending
                  ? "bg-blue-100 text-blue-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {isVerified
                ? "✓"
                : isRejected
                ? "!"
                : isPending
                ? "..."
                : "!"}
            </div>

            <div className="flex-1">

              <p className="text-sm font-semibold uppercase tracking-wide">
                Verification
              </p>

              {isVerified && (
                <>
                  <h2 className="mt-1 text-xl font-bold text-green-800">
                    Verified Landlord
                  </h2>

                  <p className="mt-1 text-sm text-green-700">
                    Your identity has been verified. You can create and
                    manage property listings.
                  </p>
                </>
              )}

              {isPending && (
                <>
                  <h2 className="mt-1 text-xl font-bold text-blue-800">
                    Verification Under Review
                  </h2>

                  <p className="mt-1 text-sm text-blue-700">
                    Your verification documents have been submitted and
                    are currently being reviewed.
                  </p>
                </>
              )}

              {isRejected && (
                <>
                  <h2 className="mt-1 text-xl font-bold text-red-800">
                    Action Required
                  </h2>

                  <p className="mt-1 text-sm text-red-700">
                    Your verification requires additional action.
                  </p>

                  {verification?.rejectionReason && (
                    <div className="mt-3 rounded-xl bg-white/70 p-3 text-sm text-red-800">
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
                  <h2 className="mt-1 text-xl font-bold text-amber-800">
                    Verification Required
                  </h2>

                  <p className="mt-1 text-sm text-amber-700">
                    Complete identity verification before creating
                    property listings.
                  </p>
                </>
              )}

            </div>

            {!isVerified && (
              <Link
                href="/dashboard/landlord/verification"
                className="rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white hover:bg-brand-blue-dark"
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

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Information associated with your landlord account.
              </p>
            </div>

            <Link
              href="/dashboard/landlord/profile/edit"
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Edit Profile
            </Link>

          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">

            {/* Name */}

            <div>
              <p className="text-sm font-medium text-slate-500">
                Full Name
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {user.name || "Not provided"}
              </p>
            </div>

            {/* Email */}

            <div>
              <p className="text-sm font-medium text-slate-500">
                Email Address
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {user.email}
              </p>
            </div>

            {/* Account */}

            <div>
              <p className="text-sm font-medium text-slate-500">
                Account Type
              </p>

              <p className="mt-1 font-medium text-slate-900">
                Landlord
              </p>
            </div>

            {/* Account Status */}

            <div>
              <p className="text-sm font-medium text-slate-500">
                Account Status
              </p>

              <p
                className={`mt-1 font-semibold ${
                  user.verified
                    ? "text-green-600"
                    : "text-amber-600"
                }`}
              >
                {user.verified
                  ? "Verified"
                  : "Verification Required"}
              </p>
            </div>

          </div>
        </section>

        {/* ================================================== */}
        {/* LISTING ACCESS */}
        {/* ================================================== */}

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-slate-900">
            Listing Access
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Your verification status determines whether you can add
            properties.
          </p>

          <div className="mt-5">

            {isVerified ? (
              <div className="rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700">
                ✓ Your account is verified. You can create property
                listings.
              </div>
            ) : (
              <div className="rounded-xl bg-amber-50 p-4 text-sm font-medium text-amber-700">
                ⚠ You must complete landlord verification before you can
                create a property listing.
              </div>
            )}

          </div>

        </section>

        {/* Privacy */}

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">

          <p className="text-sm text-slate-600">
            🔒 Your personal information and verification documents are
            private and are not displayed publicly to students.
          </p>

        </div>

      </div>
    </main>
  );
}

function DocumentStatus({
  exists,
  status,
}: {
  exists: boolean;
  status?: string;
}) {
  if (!exists) {
    return (
      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
        Required
      </span>
    );
  }

  if (status === "APPROVED") {
    return (
      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        Approved
      </span>
    );
  }

  if (status === "REJECTED") {
    return (
      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
        Action Required
      </span>
    );
  }

  return (
    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
      Under Review
    </span>
  );
}