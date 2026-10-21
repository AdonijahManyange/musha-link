import ViewTitleDeedButton from "./ViewTitleDeedButton";
import VerificationActions from "./VerificationActions";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  UserRound,
  MapPin,
  FileText,
  AlertCircle,
  Clock3,
} from "lucide-react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

// ============================================================
// REUSABLE STATUS BADGE
// ============================================================

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles: Record<string, string> = {
    APPROVED:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
    REJECTED:
      "bg-red-500/10 text-red-600 dark:text-red-400 ring-red-500/20",
    ACTION_REQUIRED:
      "bg-orange-500/10 text-orange-600 dark:text-orange-400 ring-orange-500/20",
    PENDING:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-amber-500/20",
  };

  return (
    <span
      className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
        styles[status] ??
        "bg-surface-secondary text-text-secondary ring-border"
      }`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

// ============================================================
// REUSABLE VERIFICATION INDICATOR
// ============================================================

function VerificationIndicator({
  label,
  verified,
}: {
  label: string;
  verified: boolean;
}) {
  const Icon = verified ? CheckCircle2 : XCircle;

  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-4 last:border-b-0">
      <span className="text-sm font-medium text-text-secondary">
        {label}
      </span>

      <span
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
          verified
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : "bg-red-500/10 text-red-600 dark:text-red-400"
        }`}
      >
        <Icon size={15} />
        {verified ? "Verified" : "Not Verified"}
      </span>
    </div>
  );
}

// ============================================================
// REUSABLE INFORMATION FIELD
// ============================================================

function InformationField({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </p>

      <p className="mt-1.5 break-words text-sm font-medium text-text-primary">
        {value || "Not provided"}
      </p>
    </div>
  );
}

// ============================================================
// REUSABLE DOCUMENT CARD
// ============================================================

function DocumentCard({
  title,
  description,
  document,
  verificationId,
  documentType,
  buttonLabel,
  emptyMessage,
  highlighted = false,
}: {
  title: string;
  description: string;
  document: {
    fileName: string;
    status: string;
    createdAt: Date;
  } | undefined;
  verificationId: string;
  documentType: "WATER_BILL" | "ELECTRICITY_BILL" | "TITLE_DEED";
  buttonLabel: string;
  emptyMessage: string;
  highlighted?: boolean;
}) {
  return (
    <article
      className={`rounded-2xl border p-5 transition-colors duration-200 ${
        highlighted
          ? "border-blue-500/30 bg-blue-500/[0.04]"
          : "border-border bg-surface-secondary/50"
      }`}
    >
      {/* Document heading and status */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-text-secondary ring-1 ring-border">
            <FileText size={19} />
          </div>

          <div>
            <h3 className="font-semibold text-text-primary">
              {title}
            </h3>

            <p className="mt-1 text-sm text-text-muted">
              {description}
            </p>
          </div>
        </div>

        {document ? (
          <StatusBadge status={document.status} />
        ) : (
          <span className="inline-flex w-fit items-center rounded-full bg-surface text-text-muted ring-1 ring-border px-3 py-1 text-xs font-semibold">
            NOT UPLOADED
          </span>
        )}
      </div>

      {/* Document information or missing-document message */}
      {document ? (
        <div className="mt-5 rounded-xl border border-border bg-surface p-4">
          <p className="break-all text-sm font-medium text-text-primary">
            {document.fileName}
          </p>

          <p className="mt-2 text-xs text-text-muted">
            Submitted{" "}
            {document.createdAt.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
              timeZone: "Africa/Harare",
            })}
          </p>

          <div className="mt-4">
            <ViewTitleDeedButton
              verificationId={verificationId}
              documentType={documentType}
              label={buttonLabel}
            />
          </div>
        </div>
      ) : (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4">
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0 text-red-500"
          />

          <p className="text-sm leading-6 text-text-secondary">
            {emptyMessage}
          </p>
        </div>
      )}
    </article>
  );
}

// ============================================================
// MAIN VERIFICATION REVIEW PAGE
// ============================================================

export default async function VerificationReviewPage({
  params,
}: Props) {
  // Only administrators may access this page.
  await requireAdmin();

  const { id } = await params;

  // Retrieve the verification and associated landlord details.
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

  // Retrieve all ownership documents for this landlord.
  const documents =
    await prisma.verificationDocument.findMany({
      where: {
        userId: verification.landlordId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

  // Find each document by its database type.
  const titleDeed = documents.find(
    (document) => document.type === "TITLE_DEED"
  );

  const waterBill = documents.find(
    (document) => document.type === "WATER_BILL"
  );

  const electricityBill = documents.find(
    (document) => document.type === "ELECTRICITY_BILL"
  );

  const profile = verification.landlord.landlordProfile;

  const location = [
    profile?.city,
    profile?.province,
    profile?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-text-primary transition-colors duration-200 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* ====================================================
            BACK NAVIGATION
        ==================================================== */}

        <div className="mb-8">
          <Link
            href="/dashboard/admin"
            className="group inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-secondary shadow-sm transition-colors hover:border-blue-500 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <ArrowLeft
              size={17}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back to Verification Requests
          </Link>
        </div>

        {/* ====================================================
            PAGE HEADER
        ==================================================== */}

        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <ShieldCheck size={14} />
              Landlord Verification
            </span>

            <StatusBadge status={verification.status} />
          </div>

          <h1 className="mt-4 break-words text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {verification.landlord.name || "Unnamed Landlord"}
          </h1>

          <p className="mt-2 break-all text-sm text-text-muted">
            {verification.landlord.email}
          </p>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-text-secondary">
            Review the landlord&apos;s identity verification results,
            contact information, ownership documents, and overall
            verification status before making a decision.
          </p>
        </header>

        {/* ====================================================
            IDENTITY AND LANDLORD INFORMATION
        ==================================================== */}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Identity Verification */}
          <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <ShieldCheck size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-text-primary">
                  Identity Verification
                </h2>

                <p className="mt-1 text-sm leading-5 text-text-muted">
                  Results from the landlord identity verification process.
                </p>
              </div>
            </div>

            <div className="mt-5">
              <VerificationIndicator
                label="Identity"
                verified={verification.identityVerified}
              />

              <VerificationIndicator
                label="Liveness"
                verified={verification.livenessVerified}
              />

              <VerificationIndicator
                label="Face Match"
                verified={verification.faceMatchVerified}
              />
            </div>
          </section>

          {/* Landlord Information */}
          <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <UserRound size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-text-primary">
                  Landlord Information
                </h2>

                <p className="mt-1 text-sm leading-5 text-text-muted">
                  Contact and location information provided by the landlord.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <InformationField
                label="Name"
                value={verification.landlord.name}
              />

              <InformationField
                label="Email"
                value={verification.landlord.email}
              />

              <InformationField
                label="Phone"
                value={profile?.phone}
              />

              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  <MapPin size={13} />
                  Location
                </p>

                <p className="mt-1.5 break-words text-sm font-medium text-text-primary">
                  {location || "Not provided"}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* ====================================================
            PROPERTY OWNERSHIP DOCUMENTS
        ==================================================== */}

        <section className="mt-6 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <FileText size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-text-primary">
                Property Ownership
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-text-secondary">
                Review the documents submitted to establish that the
                landlord has a legitimate connection to the property.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">

            <DocumentCard
              title="Water Bill"
              description="Ownership/residency supporting document"
              document={waterBill}
              verificationId={verification.id}
              documentType="WATER_BILL"
              buttonLabel="View Water Bill"
              emptyMessage="No water bill has been uploaded."
            />

            <DocumentCard
              title="Electricity Bill"
              description="Ownership/residency supporting document"
              document={electricityBill}
              verificationId={verification.id}
              documentType="ELECTRICITY_BILL"
              buttonLabel="View Electricity Bill"
              emptyMessage="No electricity bill has been uploaded."
            />

            <DocumentCard
              title="Title Deed"
              description="Supporting ownership document"
              document={titleDeed}
              verificationId={verification.id}
              documentType="TITLE_DEED"
              buttonLabel="View Title Deed"
              emptyMessage="No title deed has been uploaded."
              highlighted
            />

          </div>
        </section>

        {/* ====================================================
            OVERALL VERIFICATION STATUS
        ==================================================== */}

        <section className="mt-6 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <Clock3 size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-text-primary">
                Verification Status
              </h2>

              <p className="mt-1 text-sm text-text-muted">
                Current status of this landlord&apos;s verification.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-sm text-text-secondary">
              Overall status
            </span>

            <StatusBadge status={verification.status} />
          </div>

          {verification.rejectionReason && (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4">
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={19}
                  className="mt-0.5 shrink-0 text-red-500"
                />

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                    Rejection Reason
                  </p>

                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-text-secondary">
                    {verification.rejectionReason}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ====================================================
            ADMIN ACTIONS
        ==================================================== */}

        <section className="mt-6 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-text-primary">
            Review Actions
          </h2>

          <p className="mt-1 text-sm leading-6 text-text-muted">
            Approve the verification or request additional information
            according to your review findings.
          </p>

          <div className="mt-5">
            <VerificationActions
              verificationId={verification.id}
            />
          </div>
        </section>

      </div>
    </main>
  );
}