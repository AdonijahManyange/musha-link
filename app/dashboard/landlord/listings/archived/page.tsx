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
};

export default function ArchivedListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] =
    useState<string | null>(null);
  const [deletingId, setDeletingId] =
    useState<string | null>(null);
  const [error, setError] = useState("");

  // ============================================================
  // LOAD ARCHIVED LISTINGS
  // ============================================================

  async function loadArchivedListings() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/listings?status=ARCHIVED"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to load archived listings."
        );
      }

      setListings(
        data.filter(
          (listing: Listing) =>
            listing.status === "ARCHIVED"
        )
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load archived listings."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadArchivedListings();
  }, []);

  // ============================================================
  // RESTORE LISTING
  // ============================================================

  async function restoreListing(
    listingId: string
  ) {
    const confirmed = window.confirm(
      "Restore this listing? It will become a draft and will not be visible to students until you publish it again."
    );

    if (!confirmed) {
      return;
    }

    setRestoringId(listingId);
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
            status: "DRAFT",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to restore listing."
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
          : "Something went wrong while restoring the listing."
      );
    } finally {
      setRestoringId(null);
    }
  }

  // ============================================================
  // DELETE LISTING
  // ============================================================

  async function deleteListing(
    listingId: string
  ) {
    const confirmed = window.confirm(
      "Permanently delete this listing? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(listingId);
    setError("");

    try {
      const response = await fetch(
        `/api/listings/${listingId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to delete listing."
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
          : "Something went wrong while deleting the listing."
      );
    } finally {
      setDeletingId(null);
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
              href="/dashboard/landlord/listings"
              className="text-sm font-medium text-slate-600 transition hover:text-brand-blue"
            >
              ← Back to My Listings
            </Link>

            <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-brand-blue">
              Landlord Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Archived Listings
            </h1>

            <p className="mt-2 text-slate-600">
              Manage properties that are no longer
              active.
            </p>
          </div>

          <Link
            href="/dashboard/landlord/listings"
            className="inline-flex w-fit items-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            My Listings
          </Link>

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
              Loading archived listings...
            </p>
          </div>
        )}

        {/* Empty State */}

        {!loading &&
          listings.length === 0 && (
            <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                📦
              </div>

              <h2 className="mt-5 text-xl font-semibold text-slate-900">
                No archived listings
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
                Listings that you archive will
                appear here.
              </p>

              <Link
                href="/dashboard/landlord/listings"
                className="mt-6 inline-flex rounded-xl bg-brand-blue px-5 py-3 font-semibold text-white transition hover:bg-brand-blue-dark"
              >
                Back to My Listings
              </Link>

            </div>
          )}

        {/* Archived Listings */}

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

                const isRestoring =
                  restoringId ===
                  listing.id;

                const isDeleting =
                  deletingId ===
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
                            className="h-full w-full object-cover grayscale-[15%]"
                          />
                        ) : (
                          <div className="flex h-full min-h-64 items-center justify-center text-slate-400">
                            <div className="text-center">
                              <div className="text-4xl">
                                🏠
                              </div>

                              <p className="mt-2 text-sm">
                                No photos
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

                          <span className="w-fit rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            Archived
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
                              US$
                              {listing.monthlyRent}
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

                          {/* Restore */}

                          <button
                            type="button"
                            onClick={() =>
                              restoreListing(
                                listing.id
                              )
                            }
                            disabled={
                              isRestoring ||
                              isDeleting
                            }
                            className="rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isRestoring
                              ? "Restoring..."
                              : "Restore Listing"}
                          </button>

                          {/* Delete */}

                          <button
                            type="button"
                            onClick={() =>
                              deleteListing(
                                listing.id
                              )
                            }
                            disabled={
                              isDeleting ||
                              isRestoring
                            }
                            className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isDeleting
                              ? "Deleting..."
                              : "Delete Permanently"}
                          </button>

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