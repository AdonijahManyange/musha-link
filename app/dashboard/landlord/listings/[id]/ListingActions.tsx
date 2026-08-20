"use client";

import { useState } from "react";
import Link from "next/link";

type ListingActionsProps = {
  listingId: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  canPublish: boolean;
};

export default function ListingActions({
  listingId,
  status,
  canPublish,
}: ListingActionsProps) {
  const [loading, setLoading] = useState<
    "publish" | "archive" | null
  >(null);

  async function updateStatus(
    newStatus: "PUBLISHED" | "ARCHIVED"
  ) {
    const isPublishing =
      newStatus === "PUBLISHED";

    const confirmed = window.confirm(
      isPublishing
        ? "Publish this listing? Students will be able to see it."
        : "Are you sure you want to archive this listing? It will no longer be visible to students."
    );

    if (!confirmed) {
      return;
    }

    setLoading(
      isPublishing ? "publish" : "archive"
    );

    try {
      const response = await fetch(
        `/api/listings/${listingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            `Failed to ${
              isPublishing
                ? "publish"
                : "archive"
            } listing.`
        );
      }

      if (newStatus === "ARCHIVED") {
        window.location.href =
          "/dashboard/landlord/listings";
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="grid gap-3 sm:flex sm:flex-wrap">

      {/* Edit */}

      <Link
        href={`/dashboard/landlord/listings/${listingId}/edit`}
        className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        Edit Listing
      </Link>

      {/* Manage Photos */}

      <Link
        href={`/dashboard/landlord/listings/${listingId}/photos`}
        className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        Manage Photos
      </Link>

      {/* View Published Listing */}

      {status === "PUBLISHED" && (
        <Link
          href={`/listings/${listingId}`}
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          View Listing
        </Link>
      )}

      {/* Publish */}

      {status === "DRAFT" && (
        <button
          type="button"
          disabled={
            !canPublish ||
            loading !== null
          }
          onClick={() =>
            updateStatus("PUBLISHED")
          }
          className="inline-flex items-center justify-center rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading === "publish"
            ? "Publishing..."
            : "Publish Listing"}
        </button>
      )}

      {/* Archive */}

      {status !== "ARCHIVED" && (
        <button
          type="button"
          disabled={loading !== null}
          onClick={() =>
            updateStatus("ARCHIVED")
          }
          className="inline-flex items-center justify-center rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading === "archive"
            ? "Archiving..."
            : "Archive Listing"}
        </button>
      )}

      {/* Publish Requirement */}

      {status === "DRAFT" &&
        !canPublish && (
          <div className="col-span-full rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-800">
              More photos required
            </p>

            <p className="mt-1 text-sm text-amber-700">
              Add at least 5 photos before
              publishing this listing.
            </p>
          </div>
        )}

    </div>
  );
}