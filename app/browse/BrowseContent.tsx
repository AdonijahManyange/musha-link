"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import ListingCard from "@/components/listing/ListingCard";
import SearchBar from "@/components/home/SearchBar";

type ListingPhoto = {
  id: string;
  url: string;
  fileName: string;
  sortOrder: number;
  isCover: boolean;
};

type DatabaseListing = {
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

export default function BrowseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [listings, setListings] = useState<
    DatabaseListing[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const university =
    searchParams.get("university") || "";

  const roomType =
    searchParams.get("roomType") || "";

  const budget =
    searchParams.get("budget") || "";

  useEffect(() => {
    async function loadListings() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/listings?status=PUBLISHED",
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to load listings."
          );
        }

        setListings(data);
      } catch (err) {
        console.error(
          "Failed to load browse listings:",
          err
        );

        setError(
          "Unable to load accommodation listings."
        );
      } finally {
        setLoading(false);
      }
    }

    loadListings();
  }, []);

  // ============================================================
  // FILTER DATABASE LISTINGS
  // ============================================================

  const filteredListings = listings.filter(
    (listing) => {
      const matchesUniversity =
        !university ||
        listing.university.name ===
          university ||
        listing.university.name
          .toLowerCase()
          .replace(/\s+/g, "-") ===
          university.toLowerCase();

      const matchesRoomType =
        !roomType ||
        listing.roomType === roomType;

      let matchesBudget = true;

      switch (budget) {
        case "under-100":
          matchesBudget =
            listing.monthlyRent < 100;
          break;

        case "100-150":
          matchesBudget =
            listing.monthlyRent >= 100 &&
            listing.monthlyRent <= 150;
          break;

        case "150-200":
          matchesBudget =
            listing.monthlyRent >= 150 &&
            listing.monthlyRent <= 200;
          break;

        case "200+":
          matchesBudget =
            listing.monthlyRent >= 200;
          break;
      }

      return (
        matchesUniversity &&
        matchesRoomType &&
        matchesBudget
      );
    }
  );

  // ============================================================
  // CONVERT DATABASE LISTINGS TO LISTING CARD FORMAT
  // ============================================================

  const listingCards = filteredListings.map(
    (listing) => {
      const coverPhoto =
        listing.photos.find(
          (photo) => photo.isCover
        ) ||
        listing.photos[0];

      return {
        id: listing.id,
        slug: listing.id,

        title: listing.title,

        university:
          listing.university.name,

        suburb: listing.city,

        city: listing.city,

        roomType:
          formatRoomType(
            listing.roomType
          ),

        price: listing.monthlyRent,

        images: coverPhoto
          ? [coverPhoto.url]
          : [
              "/images/listings/room2.png",
            ],

        description:
          listing.description,

        amenities: [],

        featured: false,

        verified:
          listing.status ===
            "PUBLISHED" &&
          listing.isActive,

        landlord: {
          name: "",
          phone: "",
          email: "",
        },
      };
    }
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <h1 className="text-5xl font-bold tracking-tight text-slate-900">
        Browse Accommodation
      </h1>

      <p className="mt-3 max-w-2xl text-lg text-slate-600">
        Find verified student accommodation
        near your university across Zimbabwe.
      </p>

      {/* ======================================================
          SEARCH
      ====================================================== */}

      <div className="mt-10 rounded-3xl bg-white p-6 shadow-lg">
        <SearchBar />
      </div>

      {/* ======================================================
          RESULTS HEADER
      ====================================================== */}

      <div className="mt-14 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-slate-900">
          {loading
            ? "Loading listings..."
            : `${filteredListings.length} Listings Found`}
        </h2>

        {(university ||
          budget ||
          roomType) && (
          <button
            type="button"
            onClick={() => {
              router.replace("/browse");
            }}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Reset Filters
          </button>
        )}

      </div>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ======================================================
          LOADING
      ====================================================== */}

      {loading && (
        <div className="mt-8 grid gap-10 md:grid-cols-2 lg:grid-cols-3">

          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="h-[450px] animate-pulse rounded-2xl bg-slate-200"
            />
          ))}

        </div>
      )}

      {/* ======================================================
          LISTINGS
      ====================================================== */}

      {!loading &&
        !error &&
        listingCards.length > 0 && (
          <div className="mt-8 grid gap-10 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-500">

            {listingCards.map(
              (listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                />
              )
            )}

          </div>
        )}

      {/* ======================================================
          EMPTY STATE
      ====================================================== */}

      {!loading &&
        !error &&
        listingCards.length === 0 && (
          <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
              🏠
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              No listings found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
              We couldn't find accommodation
              matching your current filters.
              Try adjusting your search.
            </p>

            {(university ||
              budget ||
              roomType) && (
              <button
                type="button"
                onClick={() => {
                  router.replace(
                    "/browse"
                  );
                }}
                className="mt-6 rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark"
              >
                Clear Filters
              </button>
            )}

          </div>
        )}

    </main>
  );
}

/* ============================================================
   HELPERS
============================================================ */

function formatRoomType(
  roomType: string
) {
  const labels: Record<
    string,
    string
  > = {
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