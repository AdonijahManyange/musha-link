"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  verificationId: string;
};

export default function VerificationActions({
  verificationId,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [rejectionReason, setRejectionReason] =
    useState("");
  const [error, setError] = useState("");

  async function approve() {
    const confirmed = window.confirm(
      "Are you sure you want to approve this landlord?"
    );

    if (!confirmed) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/verifications/${verificationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "APPROVE",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to approve verification."
        );
      }

      router.push("/dashboard/admin");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  async function reject() {
    if (!rejectionReason.trim()) {
      setError("Please provide a rejection reason.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/verifications/${verificationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "REJECT",
            rejectionReason,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to reject verification."
        );
      }

      router.push("/dashboard/admin");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">
        Admin Decision
      </h2>

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!showReject ? (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={approve}
            disabled={loading}
            className="rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Processing..." : "Approve Landlord"}
          </button>

          <button
            type="button"
            onClick={() => setShowReject(true)}
            disabled={loading}
            className="rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      ) : (
        <div className="mt-5">
          <label
            htmlFor="rejectionReason"
            className="text-sm font-medium text-slate-700"
          >
            Reason for rejection
          </label>

          <textarea
            id="rejectionReason"
            value={rejectionReason}
            onChange={(event) =>
              setRejectionReason(event.target.value)
            }
            placeholder="Explain why this verification was rejected..."
            rows={4}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
          />

          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={reject}
              disabled={loading}
              className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : "Confirm Rejection"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowReject(false);
                setError("");
              }}
              disabled={loading}
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}