"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Verification = {
  id: string;
  status: "PENDING" | "ACTION_REQUIRED";
  createdAt: string;

  landlord: {
    id: string;
    name: string | null;
    email: string;
    verified: boolean;

    verificationDocuments: {
      type:
        | "ID"
        | "TITLE_DEED"
        | "WATER_BILL"
        | "ELECTRICITY_BILL";
      status:
        | "PENDING"
        | "ACTION_REQUIRED"
        | "APPROVED"
        | "REJECTED";
      fileName: string;
    }[];

    landlordProfile: {
      phone: string | null;
      city: string | null;
      province: string | null;
      country: string | null;
    } | null;
  };
};

export default function VerificationQueue() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVerifications() {
      try {
        const response = await fetch(
          "/api/admin/verifications",
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error("Failed to load verifications");
        }

        const data = await response.json();

        setVerifications(data);
      } catch (error) {
        console.error(
          "Failed to load verification queue:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadVerifications();
  }, []);

  if (loading) {
    return (
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">
          Loading verification requests...
        </p>
      </div>
    );
  }

  return (
    <section className="mt-10">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900">
          Landlord Verification Requests
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Review landlords waiting for identity or property
          verification.
        </p>
      </div>

      {verifications.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="font-medium text-slate-900">
            No pending verification requests
          </p>

          <p className="mt-1 text-sm text-slate-500">
            New landlord verification requests will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {verifications.map((verification) => {
            const profile =
              verification.landlord.landlordProfile;

            const titleDeed =
              verification.landlord.verificationDocuments.find(
                (document) => document.type === "TITLE_DEED"
              );

            return (
              <Link
                key={verification.id}
                href={`/dashboard/admin/verifications/${verification.id}`}
                className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-blue/40 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  {/* Landlord information */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-slate-900 transition-colors group-hover:text-brand-blue">
                        {verification.landlord.name || "Unnamed Landlord"}
                      </h3>

                      <span className="hidden text-xs text-slate-400 sm:inline">
                        •
                      </span>

                      <span className="hidden text-xs font-medium text-slate-400 sm:inline">
                        Review request
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      {verification.landlord.email}
                    </p>

                    <p className="mt-2 text-sm text-slate-600">
                      {profile?.city || "City not provided"}
                      {profile?.province ? `, ${profile.province}` : ""}
                    </p>
                  </div>

                  {/* Status + action */}
                  <div className="flex items-center justify-between gap-6 sm:justify-end">
                    <div className="flex flex-col items-start gap-2 sm:items-end">
                      <span
                        className={
                          verification.status === "ACTION_REQUIRED"
                            ? "rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700"
                            : "rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700"
                        }
                      >
                        {verification.status === "ACTION_REQUIRED"
                          ? "Action Required"
                          : "Pending"}
                      </span>

                      <span className="text-xs text-slate-500">
                        Title Deed:{" "}
                        <span className="font-medium text-slate-700">
                          {titleDeed?.status ?? "NOT SUBMITTED"}
                        </span>
                      </span>
                    </div>

                    {/* Click affordance */}
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-400 transition-all group-hover:border-brand-blue/30 group-hover:bg-blue-50 group-hover:text-brand-blue">
                      <span
                        className="text-lg transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}