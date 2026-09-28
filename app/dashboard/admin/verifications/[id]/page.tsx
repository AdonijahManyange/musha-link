import ViewTitleDeedButton from "./ViewTitleDeedButton";
import VerificationActions from "./VerificationActions";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

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

  const profile =
    verification.landlord.landlordProfile;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div>
        <p className="text-sm font-semibold text-brand-blue">
          Landlord Verification
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          {verification.landlord.name ||
            "Unnamed Landlord"}
        </h1>

        <p className="mt-1 text-slate-500">
          {verification.landlord.email}
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Identity */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Identity Verification
          </h2>

          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">
                Identity
              </span>

              <span className="font-semibold">
                {verification.identityVerified
                  ? "✅ Verified"
                  : "❌ Not Verified"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Liveness
              </span>

              <span className="font-semibold">
                {verification.livenessVerified
                  ? "✅ Verified"
                  : "❌ Not Verified"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Face Match
              </span>

              <span className="font-semibold">
                {verification.faceMatchVerified
                  ? "✅ Verified"
                  : "❌ Not Verified"}
              </span>
            </div>
          </div>
        </section>

        {/* Landlord */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Landlord Information
          </h2>

          <div className="mt-5 space-y-3 text-sm">
            <p>
              <span className="text-slate-500">
                Name:
              </span>{" "}
              {verification.landlord.name ||
                "Not provided"}
            </p>

            <p>
              <span className="text-slate-500">
                Email:
              </span>{" "}
              {verification.landlord.email}
            </p>

            <p>
              <span className="text-slate-500">
                Phone:
              </span>{" "}
              {profile?.phone || "Not provided"}
            </p>

            <p>
              <span className="text-slate-500">
                Location:
              </span>{" "}
              {profile?.city || "Not provided"}
              {profile?.province
                ? `, ${profile.province}`
                : ""}
              {profile?.country
                ? `, ${profile.country}`
                : ""}
            </p>
          </div>
        </section>
      </div>

      {/* Title Deed */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          Property Ownership
        </h2>

        <div className="mt-5">
          <p className="text-sm text-slate-500">
            Title Deed Status
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            {verification.titleDeedStatus}
          </p>

          {verification.titleDeedUrl ? (
            <ViewTitleDeedButton
              verificationId={verification.id}
            />
          ) : (
            <p className="mt-4 text-sm text-red-600">
              No title deed has been uploaded.
            </p>
          )}
        </div>
      </section>

      {/* Status */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          Verification Status
        </h2>

        <p className="mt-3 text-sm text-slate-600">
          Overall status:{" "}
          <span className="font-semibold text-slate-900">
            {verification.status}
          </span>
        </p>

        {verification.rejectionReason && (
          <p className="mt-3 text-sm text-red-600">
            Rejection reason:{" "}
            {verification.rejectionReason}
          </p>
        )}
      </section>
      <VerificationActions verificationId={verification.id} />
    </main>
  );
}