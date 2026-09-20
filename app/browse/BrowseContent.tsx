"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";

import ListingCard from "@/components/listing/ListingCard";
import BrowseFilters from "./BrowseFilters";

const BrowseMap = dynamic(
  () => import("./BrowseMap"),
  {
    ssr: false,
  }
);

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
  suburb: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
  monthlyRent: number;
  propertyType: string;
  roomType: string;
  genderPreference: string;
  description: string;
  amenities: string[];
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

  const [sort, setSort] = useState("recommended");

  const university =
    searchParams.get("university") || "";

  const roomType =
    searchParams.get("roomType") || "";

  const budget =
    searchParams.get("budget") || "";

  const search =
    searchParams.get("search") || "";

  const gender =
    searchParams.get("gender") || "";

  const distance =
    searchParams.get("distance") || "";

  useEffect(() => {
    async function loadListings() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/listings?status=PUBLISHED${
            university
              ? `&university=${encodeURIComponent(
                  university
                )}`
              : ""
          }`,
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
  }, [university]);

  // ============================================================
  // FILTER DATABASE LISTINGS
  // ============================================================

  const filteredListings = listings.filter(
    (listing) => {
      const matchesRoomType =
        !roomType ||
        listing.roomType === roomType;

      const matchesGender =
        !gender ||
        listing.genderPreference === gender;

      const matchesDistance =
        !distance ||
        (
          listing.distanceToUniversityKm !== null &&
          listing.distanceToUniversityKm <=
            Number(distance)
        );

      const searchTerm =
        search.toLowerCase();

      const matchesSearch =
        !search ||
        listing.title
          ?.toLowerCase()
          .includes(searchTerm) ||
        listing.suburb
          ?.toLowerCase()
          .includes(searchTerm) ||
        listing.city
          ?.toLowerCase()
          .includes(searchTerm) ||
        listing.university?.name
          ?.toLowerCase()
          .includes(searchTerm);

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
        matchesSearch &&
        matchesRoomType &&
        matchesBudget &&
        matchesGender &&
        matchesDistance
      );
    }
  );

  const sortedListings = [...filteredListings].sort(
  (a, b) => {
    switch (sort) {
      case "price-low":
        return a.monthlyRent - b.monthlyRent;

      case "price-high":
        return b.monthlyRent - a.monthlyRent;

      case "distance":
        if (
          a.distanceToUniversityKm === null
        ) {
          return 1;
        }

        if (
          b.distanceToUniversityKm === null
        ) {
          return -1;
        }

        return (
          a.distanceToUniversityKm -
          b.distanceToUniversityKm
        );

      case "newest":
        // The API currently returns newest first,
        // so keep the existing order for now.
        return 0;

      case "recommended":
      default:
        // Keep the existing API order.
        return 0;
    }
  }
);

  // ============================================================
  // CONVERT DATABASE LISTINGS TO LISTING CARD FORMAT
  // ============================================================

  const listingCards = sortedListings.map(
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

        suburb: listing.suburb,

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
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1500px] px-8 py-16">

        {/* ======================================================
            BROWSE HERO
        ====================================================== */}

        <section className="relative overflow-hidden rounded-3xl">

          {/* Background image */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="/images/hero2.jpg"
              alt=""
              fill
              priority
              className="
                object-cover
                scale-[1.5]
                translate-x-[25%]
                object-[78%_85%]
                md:scale-100
                md:translate-x-20
                md:object-[65%_25%]
              "
            />
          </div>

          {/* Warm khaki glow behind the hero content */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(245,239,220,0.98) 0%, rgba(245,239,220,0.92) 32%, rgba(245,239,220,0.68) 52%, rgba(245,239,220,0.20) 75%, transparent 100%)",
            }}
          />

          {/* Hero content */}
          <div className="relative px-5 pb-16 pt-8 sm:px-8 sm:pb-32 sm:pt-14 md:px-12 md:pt-16">

            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight drop-shadow-[0_2px_3px_rgba(245,239,220,0.9)] sm:text-5xl md:text-6xl">
              <span className="text-[#183B73]">
                Browse
              </span>

              <br />

              <span className="text-[#2FA64A]">
                Accommodation
              </span>
            </h1>

            <p className="mt-3 max-w-xl text-sm font-bold leading-6 text-[#102A56] drop-shadow-[0_1px_1px_rgba(255,255,255,0.55)] sm:text-base md:text-lg">
              Find your next student home in Zimbabwe.
            </p>

            {/* Trust points - desktop/tablet only */}
            <div className="mt-8 hidden flex-wrap items-center gap-3 sm:flex">

              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/55 px-3 py-1.5 text-xs font-bold text-[#183B73] backdrop-blur-sm">
                <span>✓</span>
                <span>Verified Listings</span>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/55 px-3 py-1.5 text-xs font-bold text-[#183B73] backdrop-blur-sm">
                <span>🛡️</span>
                <span>Safe & Secure</span>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/55 px-3 py-1.5 text-xs font-bold text-[#183B73] backdrop-blur-sm">
                <span>👥</span>
                <span>Built for Students</span>
              </div>

            </div>
          </div>
        </section>

        {/* ======================================================
            SEARCH & FILTERS
        ====================================================== */}

        <div className="relative z-10 -mt-10 px-3 sm:-mt-20 sm:px-5 md:px-8">
          <div className="rounded-3xl bg-white p-5 shadow-xl ring-1 ring-slate-200 md:p-6">
            <BrowseFilters />
          </div>
        </div>

        {/* ======================================================
            RESULTS HEADER
        ====================================================== */}

        <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <h2 className="text-2xl font-bold text-slate-900">
            {loading
              ? "Loading listings..."
              : `${sortedListings.length} Listings Found`}
          </h2>

          <div className="flex items-center gap-3">

            {/* Sort */}
            <label
              htmlFor="sort"
              className="text-sm font-medium text-slate-600"
            >
              Sort:
            </label>

            <select
              id="sort"
              value={sort}
              onChange={(event) =>
                setSort(event.target.value)
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
            >
              <option value="recommended">
                Recommended
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

              <option value="distance">
                Distance: Nearest First
              </option>

              <option value="newest">
                Newest Listings
              </option>
            </select>

            {/* Reset Filters */}
            {(search ||
              university ||
              budget ||
              roomType ||
              gender ||
              distance) && (
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
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.2fr]">

              {/* Listings */}
              <div className="grid gap-8 md:grid-cols-2">
                {listingCards.map(
                  (listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                    />
                  )
                )}
              </div>

              {/* Map */}
              <BrowseMap
                listings={filteredListings.map(
                  (listing) => ({
                    id: listing.id,
                    title: listing.title,
                    latitude:
                      listing.latitude,
                    longitude:
                      listing.longitude,
                    monthlyRent:
                      listing.monthlyRent,
                    suburb:
                      listing.suburb,
                    city:
                      listing.city,
                  })
                )}
              />

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
                roomType ||
                gender ||
                distance ||
                search) && (
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

      </div>
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