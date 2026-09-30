import ViewTitleDeedButton from "./ViewTitleDeedButton";
import VerificationActions from "./VerificationActions";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function VerificationReviewPage({
  params,
}: Props) {
  await requireAdmin();

  const { id } = await params;

  const verification =
    await prisma.landlordVerification.findUnique({
      where: {
        id,
      },
      include: {
        landlord: {
          select: {
            id: true,
            name: true,
            email: true,
            verified: true,
            landlordProfile: {
              select: {
                phone: true,
                city: true,
                province: true,
                country: true,
              },
            },
          },
        },
      },
    });

  if (!verification) {
    notFound();
  }

  // ------------------------------------------------------------
  // VERIFICATION DOCUMENTS
  // ------------------------------------------------------------

  const documents =
    await prisma.verificationDocument.findMany({
      where: {
        userId: verification.landlordId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

  const titleDeed = documents.find(
    (document) => document.type === "TITLE_DEED"
  );

  const waterBill = documents.find(
    (document) => document.type === "WATER_BILL"
  );

  const electricityBill = documents.find(
    (document) => document.type === "ELECTRICITY_BILL"
  );

  const profile =
    verification.landlord.landlordProfile;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        
      {/* BACK */}
      <div className="mb-6">
        <Link
          href="/dashboard/admin"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-brand-blue"
        >
          <span aria-hidden="true">←</span>
          Back to Verification Requests
        </Link>
      </div>
      

        {/* ====================================================== */}
        {/* HEADER */}
        {/* ====================================================== */}

        <div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              Landlord Verification
            </span>

            {verification.status === "PENDING" && (
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                Pending Review
              </span>
            )}

            {verification.status === "ACTION_REQUIRED" && (
              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                Action Required
              </span>
            )}

            {verification.status === "APPROVED" && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Approved
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
            {verification.landlord.name ||
              "Unnamed Landlord"}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {verification.landlord.email}
          </p>
        </div>

        {/* ====================================================== */}
        {/* IDENTITY + LANDLORD INFORMATION */}
        {/* ====================================================== */}

        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          {/* Identity */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Identity Verification
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Results from the landlord identity verification process.
              </p>
            </div>

            <div className="mt-6 divide-y divide-slate-100">

              {/* Identity */}
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-slate-600">
                  Identity
                </span>

                {verification.identityVerified ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    Not Verified
                  </span>
                )}
              </div>

              {/* Liveness */}
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-slate-600">
                  Liveness
                </span>

                {verification.livenessVerified ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    Not Verified
                  </span>
                )}
              </div>

              {/* Face Match */}
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-slate-600">
                  Face Match
                </span>

                {verification.faceMatchVerified ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    Not Verified
                  </span>
                )}
              </div>

            </div>
          </section>

          {/* Landlord Information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Landlord Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Contact and location information provided by the landlord.
            </p>

            <div className="mt-6 space-y-4">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Name
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {verification.landlord.name ||
                    "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Email
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {verification.landlord.email}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Phone
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {profile?.phone || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Location
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {profile?.city || "Not provided"}
                  {profile?.province
                    ? `, ${profile.province}`
                    : ""}
                  {profile?.country
                    ? `, ${profile.country}`
                    : ""}
                </p>
              </div>

            </div>
          </section>
        </div>

        {/* ====================================================== */}
        {/* PROPERTY OWNERSHIP */}
        {/* ====================================================== */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Property Ownership
            </h2>

            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Review the documents submitted to establish that the
              landlord has a legitimate connection to the property.
            </p>
          </div>

          <div className="mt-6 space-y-4">

            {/* ================================================== */}
            {/* WATER BILL */}
            {/* ================================================== */}

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Water Bill
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Ownership/residency supporting document
                  </p>
                </div>

                {waterBill ? (
                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                      waterBill.status === "APPROVED"
                        ? "bg-emerald-50 text-emerald-700"
                        : waterBill.status === "REJECTED"
                          ? "bg-red-50 text-red-700"
                          : waterBill.status ===
                              "ACTION_REQUIRED"
                            ? "bg-orange-50 text-orange-700"
                            : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {waterBill.status}
                  </span>
                ) : (
                  <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                    NOT UPLOADED
                  </span>
                )}

              </div>

              {waterBill ? (
                <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
                  <p className="break-all text-sm font-medium text-slate-800">
                    {waterBill.fileName}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Submitted{" "}
                    {waterBill.createdAt.toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div className="mt-4 rounded-lg bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium text-red-700">
                    No water bill has been uploaded.
                  </p>
                </div>
              )}

            </div>

            {/* ================================================== */}
            {/* ELECTRICITY BILL */}
            {/* ================================================== */}

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Electricity Bill
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Ownership/residency supporting document
                  </p>
                </div>

                {electricityBill ? (
                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                      electricityBill.status === "APPROVED"
                        ? "bg-emerald-50 text-emerald-700"
                        : electricityBill.status === "REJECTED"
                          ? "bg-red-50 text-red-700"
                          : electricityBill.status ===
                              "ACTION_REQUIRED"
                            ? "bg-orange-50 text-orange-700"
                            : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {electricityBill.status}
                  </span>
                ) : (
                  <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                    NOT UPLOADED
                  </span>
                )}

              </div>

              {electricityBill ? (
                <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
                  <p className="break-all text-sm font-medium text-slate-800">
                    {electricityBill.fileName}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Submitted{" "}
                    {electricityBill.createdAt.toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div className="mt-4 rounded-lg bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium text-red-700">
                    No electricity bill has been uploaded.
                  </p>
                </div>
              )}

            </div>

            {/* ================================================== */}
            {/* TITLE DEED */}
            {/* ================================================== */}

            <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-5">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Title Deed
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Supporting ownership document
                  </p>
                </div>

                {titleDeed ? (
                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                      titleDeed.status === "APPROVED"
                        ? "bg-emerald-50 text-emerald-700"
                        : titleDeed.status === "REJECTED"
                          ? "bg-red-50 text-red-700"
                          : titleDeed.status ===
                              "ACTION_REQUIRED"
                            ? "bg-orange-50 text-orange-700"
                            : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {titleDeed.status}
                  </span>
                ) : (
                  <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                    NOT UPLOADED
                  </span>
                )}

              </div>

              {titleDeed ? (
                <div className="mt-4 rounded-lg border border-blue-100 bg-white p-4">

                  <p className="break-all text-sm font-medium text-slate-800">
                    {titleDeed.fileName}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Submitted{" "}
                    {titleDeed.createdAt.toLocaleDateString()}
                  </p>

                  <div className="mt-4">
                    <ViewTitleDeedButton
                      verificationId={verification.id}
                    />
                  </div>

                </div>
              ) : (
                <div className="mt-4 rounded-lg bg-slate-100 px-4 py-3">
                  <p className="text-sm text-slate-600">
                    No title deed uploaded.
                  </p>
                </div>
              )}

            </div>

          </div>
        </section>

        {/* ====================================================== */}
        {/* VERIFICATION STATUS */}
        {/* ====================================================== */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-bold text-slate-900">
            Verification Status
          </h2>

          <div className="mt-4 flex items-center gap-3">

            <span className="text-sm text-slate-500">
              Overall status
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                verification.status === "APPROVED"
                  ? "bg-emerald-50 text-emerald-700"
                  : verification.status ===
                      "ACTION_REQUIRED"
                    ? "bg-red-50 text-red-700"
                    : "bg-amber-50 text-amber-700"
              }`}
            >
              {verification.status}
            </span>

          </div>

          {verification.rejectionReason && (
            <div className="mt-4 rounded-lg bg-red-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-red-500">
                Rejection Reason
              </p>

              <p className="mt-1 text-sm text-red-700">
                {verification.rejectionReason}
              </p>
            </div>
          )}

        </section>

        {/* ====================================================== */}
        {/* ADMIN ACTIONS */}
        {/* ====================================================== */}

        <div className="mt-6">
          <VerificationActions
            verificationId={verification.id}
          />
        </div>

      </div>
    </main>
  );
}