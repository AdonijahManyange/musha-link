"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ListingPhoto = {
  id: string;
  url: string;
  fileName: string;
  sortOrder: number;
  isCover: boolean;
};

type Listing = {
  id: string;
  title: string;
  city: string;
  province: string;
  monthlyRent: number;
  propertyType: string;
  roomType: string;
  genderPreference: string;
  description: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isActive: boolean;
  distanceToUniversityKm: number | null;
  university: {
    name: string;
    city: string;
  };
  photos: ListingPhoto[];
  canPublish: boolean;

  missingPhotoCategories: {
    category: string;
    required: number;
    uploaded: number;
  }[];
};

export default function LandlordListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const [archivingId, setArchivingId] =
    useState<string | null>(null);

  const [publishingId, setPublishingId] =
    useState<string | null>(null);

  const [confirmedListings, setConfirmedListings] =
    useState<Record<string, boolean>>({});

  const [error, setError] = useState("");

  // ============================================================
  // LOAD LISTINGS
  // ============================================================

  async function loadListings() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/listings");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to load listings."
        );
      }

      setListings(data);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load your listings."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadListings();
  }, []);

  // ============================================================
  // PUBLISH LISTING
  // ============================================================

  async function publishListing(
    listingId: string
  ) {
    const listing = listings.find(
      (item) => item.id === listingId
    );

    if (!listing) {
      return;
    }

    if (!listing.canPublish) {
      setError(
        "Complete all required photo categories before publishing this listing."
      );

      return;
    }

    if (!confirmedListings[listingId]) {
      setError(
        "Please confirm that the information and photos in this listing are accurate before publishing."
      );

      return;
    }

    const confirmed = window.confirm(
      "Submit this listing for publication? Students will be able to see it once published."
    );

    if (!confirmed) {
      return;
    }

    setPublishingId(listingId);
    setError("");

    try {
      const response = await fetch(
        `/api/listings/${listingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "PUBLISHED",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to publish listing."
        );
      }

      setListings((currentListings) =>
        currentListings.map((item) =>
          item.id === listingId
            ? {
                ...item,
                status: "PUBLISHED",
                isActive: true,
              }
            : item
        )
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while publishing the listing."
      );
    } finally {
      setPublishingId(null);
    }
  }

  // ============================================================
  // ARCHIVE LISTING
  // ============================================================

  async function archiveListing(
    listingId: string
  ) {
    const confirmed = window.confirm(
      "Are you sure you want to archive this listing? It will no longer be visible to students."
    );

    if (!confirmed) {
      return;
    }

    setArchivingId(listingId);
    setError("");

    try {
      const response = await fetch(
        `/api/listings/${listingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "ARCHIVED",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to archive listing."
        );
      }

      setListings((currentListings) =>
        currentListings.filter(
          (listing) =>
            listing.id !== listingId
        )
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while archiving the listing."
      );
    } finally {
      setArchivingId(null);
    }
  }

  // ============================================================
  // LABEL HELPERS
  // ============================================================

  function getPropertyTypeLabel(
    propertyType: string
  ) {
    const labels: Record<string, string> = {
      HOUSE: "House",
      FLAT: "Flat",
      APARTMENT: "Apartment",
      TOWNHOUSE: "Townhouse",
      COTTAGE: "Cottage",
      ROOMING_HOUSE: "Rooming House",
      OTHER: "Other",
    };

    return (
      labels[propertyType] ||
      propertyType
    );
  }

  function getRoomTypeLabel(
    roomType: string
  ) {
    const labels: Record<string, string> = {
      PRIVATE: "Private Room",
      SHARED: "Shared Room",
      ENTIRE_PROPERTY:
        "Entire Property",
    };

    return (
      labels[roomType] ||
      roomType
    );
  }

  function getStatusStyles(
    status: Listing["status"]
  ) {
    if (status === "PUBLISHED") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (status === "DRAFT") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    return "bg-slate-100 text-slate-600 border-slate-200";
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">

        {/* Header */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <Link
              href="/dashboard/landlord"
              className="text-sm font-medium text-slate-600 transition hover:text-brand-blue"
            >
              ← Back to Dashboard
            </Link>

            <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-brand-blue">
              Landlord Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              My Listings
            </h1>

            <p className="mt-2 text-slate-600">
              Create and manage your student
              accommodation properties.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/landlord/listings/archived"
              className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Archives
            </Link>

            <Link
              href="/dashboard/landlord/listings/new"
              className="inline-flex items-center rounded-xl bg-brand-blue px-5 py-3 font-semibold text-white transition hover:bg-brand-blue-dark"
            >
              + Add Property
            </Link>
          </div>

        </div>

        {/* Error */}

        {error && (
          <div className="mt-6 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <p>{error}</p>

            <button
              type="button"
              onClick={() => setError("")}
              className="font-bold text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Loading */}

        {loading && (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-600">
              Loading your listings...
            </p>
          </div>
        )}

        {/* Empty State */}

        {!loading &&
          listings.length === 0 && (
            <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                🏠
              </div>

              <h2 className="mt-5 text-xl font-semibold text-slate-900">
                No listings yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
                Add your first property and
                start connecting with students
                looking for accommodation.
              </p>

              <Link
                href="/dashboard/landlord/listings/new"
                className="mt-6 inline-flex rounded-xl bg-brand-blue px-5 py-3 font-semibold text-white transition hover:bg-brand-blue-dark"
              >
                Add Your First Property
              </Link>

            </div>
          )}

        {/* Listings */}

        {!loading &&
          listings.length > 0 && (
            <div className="mt-10 space-y-6">

              {listings.map((listing) => {
                const coverPhoto =
                  listing.photos.find(
                    (photo) =>
                      photo.isCover
                  ) ||
                  listing.photos[0];

                const photoCount =
                  listing.photos.length;

                const canPublish =
                  listing.canPublish;

                const isPublishing =
                  publishingId ===
                  listing.id;

                const isArchiving =
                  archivingId ===
                  listing.id;

                return (
                  <article
                    key={listing.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >

                    <div className="flex flex-col md:flex-row">

                      {/* Image */}

                      <div className="relative h-64 w-full shrink-0 bg-slate-100 md:h-auto md:w-72">

                        {coverPhoto ? (
                          <img
                            src={coverPhoto.url}
                            alt={listing.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full min-h-64 items-center justify-center text-slate-400">
                            <div className="text-center">
                              <div className="text-4xl">
                                🏠
                              </div>

                              <p className="mt-2 text-sm">
                                No photos yet
                              </p>
                            </div>
                          </div>
                        )}

                        {coverPhoto && (
                          <div className="absolute bottom-3 left-3 rounded-lg bg-black/70 px-3 py-1.5 text-xs font-medium text-white">
                            {photoCount}{" "}
                            {photoCount === 1
                              ? "photo"
                              : "photos"}
                          </div>
                        )}

                      </div>

                      {/* Content */}

                      <div className="flex flex-1 flex-col p-5 sm:p-6">

                        {/* Title */}

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                          <div>
                            <h2 className="text-xl font-bold text-slate-900">
                              {listing.title}
                            </h2>

                            <p className="mt-1 text-sm text-slate-600">
                              {listing.city},{" "}
                              {listing.province}
                            </p>
                          </div>

                          <span
                            className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyles(
                              listing.status
                            )}`}
                          >
                            {listing.status ===
                            "DRAFT"
                              ? "Draft"
                              : listing.status ===
                                  "PUBLISHED"
                                ? "Published"
                                : "Archived"}
                          </span>

                        </div>

                        {/* Property Details */}

                        <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">

                          <div>
                            <p className="text-slate-500">
                              Property
                            </p>

                            <p className="mt-1 font-medium text-slate-900">
                              {getPropertyTypeLabel(
                                listing.propertyType
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-slate-500">
                              Room
                            </p>

                            <p className="mt-1 font-medium text-slate-900">
                              {getRoomTypeLabel(
                                listing.roomType
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-slate-500">
                              Monthly Rent
                            </p>

                            <p className="mt-1 font-medium text-slate-900">
                              ${listing.monthlyRent}
                            </p>
                          </div>

                          <div>
                            <p className="text-slate-500">
                              University
                            </p>

                            <p className="mt-1 font-medium text-slate-900">
                              {listing.university.name}
                            </p>
                          </div>

                        </div>

                        {/* Photo Requirement */}

                        {listing.status === "DRAFT" && (
                          <div className="mt-5 rounded-xl bg-slate-50 p-4">

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                              <div>
                                <p className="text-sm font-semibold text-slate-900">
                                  Listing photos
                                </p>

                                <p className="mt-1 text-xs text-slate-600">
                                  {canPublish
                                    ? "All required photo categories are complete. Your listing is ready to publish."
                                    : "Complete all required photo categories before publishing."}
                                </p>
                              </div>

                              <span className="text-sm font-semibold text-slate-700">
                                {photoCount}/10 required photos
                              </span>

                            </div>

                            {/* Progress */}

                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">

                              <div
                                className="h-full rounded-full bg-brand-blue transition-all"
                                style={{
                                  width: `${Math.min(
                                    (Math.min(photoCount, 10) / 10) * 100,
                                    100
                                  )}%`,
                                }}
                              />

                            </div>

                            {/* Missing Categories */}

                            {!canPublish &&
                              listing.missingPhotoCategories.length > 0 && (
                                <div className="mt-4">

                                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Still needed
                                  </p>

                                  <div className="mt-2 flex flex-wrap gap-2">

                                    {listing.missingPhotoCategories.map(
                                      (item) => (
                                        <span
                                          key={item.category}
                                          className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700"
                                        >
                                          {item.category
                                            .replaceAll("_", " ")
                                            .toLowerCase()
                                            .replace(
                                              /\b\w/g,
                                              (letter) =>
                                                letter.toUpperCase()
                                            )}
                                          : {item.uploaded}/
                                          {item.required}
                                        </span>
                                      )
                                    )}

                                  </div>

                                </div>
                              )}

                            {canPublish && (
                              <p className="mt-3 text-xs font-medium text-emerald-600">
                                ✅ Required photo coverage complete
                              </p>
                            )}

                            <p className="mt-3 text-xs text-slate-500">
                              You can upload up to 20 photos total, including
                              optional photos such as beds, corridors and back yard.
                            </p>

                          </div>
                        )}

                        {/* Publishing Confirmation */}

                        {listing.status === "DRAFT" && (
                          <div className="mb-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-4">

                            <label className="flex cursor-pointer items-start gap-3">

                              <input
                                type="checkbox"
                                checked={
                                  confirmedListings[listing.id] ?? false
                                }
                                onChange={(event) =>
                                  setConfirmedListings((current) => ({
                                    ...current,
                                    [listing.id]:
                                      event.target.checked,
                                  }))
                                }
                                className="mt-1 h-5 w-5 shrink-0 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                              />

                              <span className="text-sm leading-6 text-slate-700">
                                <span className="font-semibold text-slate-900">
                                  I confirm that the information and photos
                                  in this listing are accurate and represent
                                  the property as it currently exists.
                                </span>

                                <span className="mt-1 block text-xs leading-5 text-slate-500">
                                  By submitting this listing, you acknowledge
                                  that verification does not automatically
                                  guarantee approval. Listings may be rejected,
                                  restricted, suspended or removed if they do
                                  not meet MushaLink standards.
                                </span>
                              </span>

                            </label>

                          </div>
                        )}

                        {/* Actions */}

                        <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">

                          {/* Edit */}

                          <Link
                            href={`/dashboard/landlord/listings/${listing.id}/edit`}
                            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            Edit
                          </Link>

                          {/* Manage Photos */}

                          <Link
                            href={`/dashboard/landlord/listings/${listing.id}/photos`}
                            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            Manage Photos
                          </Link>

                          {/* View Published Listing */}

                          {listing.status ===
                            "PUBLISHED" && (
                            <Link
                              href={`/listings/${listing.id}?from=dashboard`}
                              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              View Listing
                            </Link>
                          )}

                          {/* Publish */}

                          {listing.status ===
                            "DRAFT" && (
                            <button
                              type="button"
                              onClick={() =>
                                publishListing(
                                  listing.id
                                )
                              }
                              disabled={
                                !canPublish ||
                                !confirmedListings[listing.id] ||
                                isPublishing
                              }
                              className="rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isPublishing
                                ? "Publishing..."
                                : "Publish Listing"}
                            </button>
                          )}

                          {/* Archive */}

                          {listing.status !==
                            "ARCHIVED" && (
                            <button
                              type="button"
                              onClick={() =>
                                archiveListing(
                                  listing.id
                                )
                              }
                              disabled={
                                isArchiving ||
                                isPublishing
                              }
                              className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isArchiving
                                ? "Archiving..."
                                : "Archive Listing"}
                            </button>
                          )}

                        </div>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>
          )}

      </div>
    </main>
  );
}