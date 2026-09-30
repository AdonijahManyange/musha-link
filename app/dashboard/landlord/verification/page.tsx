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
      include: {
        landlord: {
          include: {
            verificationDocuments: true,
          },
        },
      },
    });

  const status =
    verification?.status ?? "NOT_STARTED";

  // ============================================================
  // IDENTITY VERIFICATION
  // ============================================================

  const identityVerified =
    Boolean(
      verification?.identityVerified &&
        verification?.livenessVerified &&
        verification?.faceMatchVerified
    );

  // ============================================================
  // SUPPORTING DOCUMENTS
  // ============================================================

  const documents =
    verification?.landlord.verificationDocuments ?? [];

  const waterBill = documents.find(
    (document) =>
      document.type === "WATER_BILL"
  );

  const electricityBill = documents.find(
    (document) =>
      document.type === "ELECTRICITY_BILL"
  );

  const titleDeed = documents.find(
    (document) =>
      document.type === "TITLE_DEED"
  );

  // ============================================================
  // OVERALL VERIFICATION STATUS
  // ============================================================

  /*
   * IMPORTANT:
   *
   * A title deed is NOT required for verification.
   *
   * The admin's overall verification decision controls whether
   * the landlord is verified.
   */
  const isVerified =
    status === "APPROVED";

  const isPending =
    status === "PENDING" ||
    status === "ACTION_REQUIRED";

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">

        {/* ================================================== */}
        {/* BACK */}
        {/* ================================================== */}

        <Link
          href="/dashboard/landlord"
          className="inline-flex items-center text-sm font-medium text-slate-600 transition hover:text-brand-blue"
        >
          ← Back to Dashboard
        </Link>

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-blue">
            Account Verification
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Landlord verification
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Verification helps students know that the landlords
            and properties listed on MushaLink are legitimate.
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
                  Your landlord verification has been approved
                  by MushaLink.
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
                    Verify your government-issued ID, liveness,
                    and face match through our secure verification
                    provider.
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
            {/* STEP 2 — SUPPORTING DOCUMENTS */}
            {/* ================================================== */}

            {identityVerified && (
              <section>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-blue text-sm font-bold text-white">
                      2
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">
                        Property &amp; residency documents
                      </h2>

                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        Upload supporting documents that help
                        MushaLink verify your connection to the
                        property.
                      </p>

                      <div className="mt-4 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800">
                        You may provide a water bill, electricity
                        bill, title deed, or other supporting
                        documentation requested by MushaLink.
                        These documents are reviewed by our team.
                      </div>
                    </div>
                  </div>

                  {/* ================================================== */}
                  {/* WATER BILL */}
                  {/* ================================================== */}

                  {waterBill ? (
                    <DocumentStatus
                      title="Water Bill"
                      status={waterBill.status}
                      fileName={waterBill.fileName}
                    />
                  ) : (
                    <TitleDeedUpload
                      type="WATER_BILL"
                      title="Water Bill"
                      description="Upload a recent water bill showing your connection to the property."
                    />
                  )}

                  {/* ================================================== */}
                  {/* ELECTRICITY BILL */}
                  {/* ================================================== */}

                  {electricityBill ? (
                    <DocumentStatus
                      title="Electricity Bill"
                      status={electricityBill.status}
                      fileName={electricityBill.fileName}
                    />
                  ) : (
                    <TitleDeedUpload
                      type="ELECTRICITY_BILL"
                      title="Electricity Bill"
                      description="Upload a recent electricity bill showing your connection to the property."
                    />
                  )}

                  {/* ================================================== */}
                  {/* TITLE DEED */}
                  {/* ================================================== */}

                  {titleDeed ? (
                    <DocumentStatus
                      title="Title Deed"
                      status={titleDeed.status}
                      fileName={titleDeed.fileName}
                    />
                  ) : (
                    <TitleDeedUpload
                      type="TITLE_DEED"
                      title="Title Deed"
                      description="Upload the property title deed if available as supporting ownership documentation."
                    />
                  )}

                </div>
              </section>
            )}

            {/* ================================================== */}
            {/* STEP 3 — ADMIN REVIEW */}
            {/* ================================================== */}

            {identityVerified && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-600">
                    3
                  </div>

                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-slate-900">
                      MushaLink review
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Our team will review your verification
                      information and supporting documents before
                      making a final decision.
                    </p>

                    {status === "ACTION_REQUIRED" ? (
                      <div className="mt-4 rounded-xl bg-amber-50 px-4 py-3">
                        <p className="text-sm font-semibold text-amber-800">
                          Action required
                        </p>

                        {verification?.rejectionReason && (
                          <p className="mt-1 text-sm text-amber-700">
                            {verification.rejectionReason}
                          </p>
                        )}
                      </div>
                    ) : isPending ? (
                      <div className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        Your verification is currently being
                        reviewed by MushaLink.
                      </div>
                    ) : (
                      <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        Complete your verification information
                        and provide any supporting documents that
                        apply to your property.
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}
          </div>
        )}

        {/* ================================================== */}
        {/* PRIVACY NOTICE */}
        {/* ================================================== */}

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-600">
            🔒 Your verification information is private and will
            only be used for account verification. It will not be
            publicly displayed on MushaLink.
          </p>
        </div>

      </div>
    </main>
  );
}

/* ============================================================ */
/* DOCUMENT STATUS */
/* ============================================================ */

function DocumentStatus({
  title,
  status,
  fileName,
}: {
  title: string;
  status: string;
  fileName: string | null;
}) {
  const normalizedStatus =
    status.toUpperCase();

  if (normalizedStatus === "APPROVED") {
    return (
      <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
            ✓
          </div>

          <div>
            <h3 className="font-semibold text-emerald-900">
              {title}
            </h3>

            <p className="mt-1 text-sm text-emerald-700">
              Document approved by MushaLink.
            </p>

            {fileName && (
              <p className="mt-2 text-xs text-emerald-700">
                {fileName}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (normalizedStatus === "REJECTED") {
    return (
      <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-5">
        <h3 className="font-semibold text-red-900">
          {title}
        </h3>

        <p className="mt-1 text-sm text-red-700">
          This document was not approved. You may upload a
          replacement document.
        </p>

        {fileName && (
          <p className="mt-2 text-xs text-red-700">
            Previous file: {fileName}
          </p>
        )}

        <p className="mt-3 text-xs text-red-600">
          Please contact MushaLink or follow any instructions
          provided during the review process.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex items-start gap-3">
        <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-amber-500" />

        <div>
          <h3 className="font-semibold text-slate-900">
            {title} submitted
          </h3>

          <p className="mt-1 text-sm text-slate-600">
            Your document has been submitted and is waiting
            for MushaLink admin review.
          </p>

          {fileName && (
            <p className="mt-2 text-xs text-slate-500">
              {fileName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}