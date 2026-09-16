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

  // Mandatory confirmation required before publishing.
  const [listingConfirmation, setListingConfirmation] =
    useState(false);

  async function updateStatus(
    newStatus: "PUBLISHED" | "ARCHIVED"
  ) {
    const isPublishing =
      newStatus === "PUBLISHED";

    // Publishing requires the landlord to explicitly
    // confirm that the listing information and photos
    // accurately represent the property.
    if (
      isPublishing &&
      !listingConfirmation
    ) {
      alert(
        "Please confirm that the information and photos in this listing are accurate before submitting."
      );
      return;
    }

    const confirmed = window.confirm(
      isPublishing
        ? "Submit this listing for publication? Students will be able to see it once published."
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

      {/* Publish Confirmation */}

      {status === "DRAFT" && (
        <div className="col-span-full rounded-xl border border-slate-200 bg-slate-50 p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={listingConfirmation}
              onChange={(event) =>
                setListingConfirmation(
                  event.target.checked
                )
              }
              className="mt-1 h-5 w-5 shrink-0 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
            />

            <span className="text-sm leading-6 text-slate-700">
              <span className="font-semibold text-slate-900">
                I confirm that the information and photos
                in this listing are accurate and represent
                the property as it currently exists.
              </span>
            </span>
          </label>

          <div className="mt-4 border-l-4 border-slate-300 pl-4 text-sm leading-6 text-slate-600">
            By submitting this listing, you acknowledge
            that verification does not automatically
            guarantee approval. Listings may be rejected,
            restricted, suspended or removed if they do not
            meet MushaLink standards.
          </div>
        </div>
      )}

      {/* Publish */}

      {status === "DRAFT" && (
        <button
          type="button"
          disabled={
            !canPublish ||
            !listingConfirmation ||
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

      {status === "DRAFT" && (
        <div
          className={`col-span-full rounded-xl border p-4 ${
            canPublish
              ? "border-green-200 bg-green-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          {canPublish ? (
            <>
              <p className="text-sm font-semibold text-green-800">
                ✅ Your listing is ready to publish
              </p>

              <p className="mt-1 text-sm text-green-700">
                You have completed the required photo
                categories. Your listing is still a Draft
                and remains private until you publish it.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-amber-800">
                📸 Your listing is still a Draft
              </p>

              <p className="mt-1 text-sm text-amber-700">
                Complete all required photo categories
                before publishing your listing.
              </p>

              <p className="mt-2 text-xs text-amber-600">
                Required coverage includes the living room,
                bedrooms, bathrooms, front yard/exterior,
                parking, main entrance and veranda.
              </p>
            </>
          )}
        </div>
      )}

    </div>
  );
}