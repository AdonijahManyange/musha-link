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

export default function LandlordListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [archivingId, setArchivingId] = useState<string | null>(
    null
  );

  async function loadListings() {
    try {
      const response = await fetch("/api/listings");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load listings."
        );
      }

      setListings(data);
    } catch (error) {
      console.error(error);
      alert("Unable to load your listings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadListings();
  }, []);

  async function archiveListing(listingId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to archive this listing? It will no longer be visible to students."
    );

    if (!confirmed) {
      return;
    }

    setArchivingId(listingId);

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
        alert(
          data.error ||
            "Failed to archive listing."
        );
        return;
      }

      setListings((currentListings) =>
        currentListings.filter(
          (listing) =>
            listing.id !== listingId
        )
      );
    } catch (error) {
      console.error(error);
      alert(
        "Something went wrong while archiving the listing."
      );
    } finally {
      setArchivingId(null);
    }
  }

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

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
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

          <Link
            href="/dashboard/landlord/listings/new"
            className="inline-flex w-fit items-center rounded-xl bg-brand-blue px-5 py-3 font-semibold text-white transition hover:bg-brand-blue-dark"
          >
            + Add Property
          </Link>
        </div>

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
                  photoCount >= 5;

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

                      <div className="flex flex-1 flex-col p-6">

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

                        {listing.status ===
                          "DRAFT" && (
                          <div className="mt-5 rounded-xl bg-slate-50 p-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                              <div>
                                <p className="text-sm font-semibold text-slate-900">
                                  Listing photos
                                </p>

                                <p className="mt-1 text-xs text-slate-600">
                                  {photoCount < 1
                                    ? "Add at least 1 photo to save your listing."
                                    : photoCount <
                                        5
                                      ? `Add ${5 - photoCount} more ${
                                          5 - photoCount ===
                                          1
                                            ? "photo"
                                            : "photos"
                                        } before publishing.`
                                      : "You have enough photos to publish your listing."}
                                </p>
                              </div>

                              <span className="text-sm font-semibold text-slate-700">
                                {photoCount}/10
                              </span>

                            </div>

                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                              <div
                                className="h-full rounded-full bg-brand-blue transition-all"
                                style={{
                                  width: `${Math.min(
                                    (photoCount /
                                      10) *
                                      100,
                                    100
                                  )}%`,
                                }}
                              />
                            </div>

                            <p className="mt-2 text-xs text-slate-500">
                              We recommend 10 photos
                              for the best listing.
                            </p>
                          </div>
                        )}

                        {/* Actions */}

                        <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">

                          <Link
                            href={`/dashboard/landlord/listings/${listing.id}/edit`}
                            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            Edit
                          </Link>

                          <Link
                            href={`/dashboard/landlord/listings/${listing.id}/photos`}
                            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            Manage Photos
                          </Link>

                          {listing.status ===
                            "PUBLISHED" && (
                            <Link
                              href={`/listings/${listing.id}`}
                              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              View Listing
                            </Link>
                          )}

                          {listing.status ===
                            "DRAFT" &&
                            canPublish && (
                              <button
                                type="button"
                                className="rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-blue-dark"
                              >
                                Publish Listing
                              </button>
                            )}

                          <button
                            type="button"
                            onClick={() =>
                              archiveListing(
                                listing.id
                              )
                            }
                            disabled={
                              archivingId ===
                              listing.id
                            }
                            className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {archivingId ===
                            listing.id
                              ? "Archiving..."
                              : "Archive Listing"}
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