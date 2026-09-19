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
              ? `&university=${encodeURIComponent(university)}`
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

      const searchTerm = search.toLowerCase();

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
        <Image
          src="/images/herotitle.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />

        {/* Warm khaki glow behind the hero content */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(245, 239, 220, 0.95) 0%, rgba(245, 239, 220, 0.78) 28%, rgba(245, 239, 220, 0.45) 48%, rgba(245, 239, 220, 0.08) 72%, transparent 100%)",
          }}
        />

        

        <div className="relative px-5 pb-20 pt-10 sm:px-8 sm:pb-32 sm:pt-14 md:px-12 md:pt-16">
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight drop-shadow-[0_2px_3px_rgba(0,0,0,0.18)] sm:text-5xl md:text-6xl">
            <span className="text-[#183B73]">Browse</span>
            <br />
            <span className="text-[#2FA64A]">
              Accommodation
            </span>
          </h1>


          <p className="mt-3 max-w-xl text-sm font-semibold leading-6 text-[#183B73] sm:text-base md:text-lg">
            Find verified student accommodation near your
            university across Zimbabwe.
          </p>

          {/* Trust points */}
          <div className="mt-7 flex flex-wrap gap-2.5 sm:mt-8 sm:gap-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/55 px-3 py-1.5 text-xs font-semibold text-[#183B73] backdrop-blur-sm">
              <span>✓</span>
              <span>Verified Listings</span>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/55 px-3 py-1.5 text-xs font-semibold text-[#183B73] backdrop-blur-sm">
              <span>🛡️</span>
              <span>Safe & Secure</span>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/55 px-3 py-1.5 text-xs font-semibold text-[#183B73] backdrop-blur-sm">
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

      <div className="mt-14 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-slate-900">
          {loading
            ? "Loading listings..."
            : `${filteredListings.length} Listings Found`}
        </h2>

        {(search ||
          university ||
          budget ||
          roomType ||
          gender ||
          distance) && (
          gender ||
          distance ||
          search) && (
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
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            {/* Listings */}
            <div className="grid gap-8 md:grid-cols-2">
              {listingCards.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                />
              ))}
            </div>

            {/* Map */}
            <BrowseMap
              listings={filteredListings.map((listing) => ({
                id: listing.id,
                title: listing.title,
                latitude: listing.latitude,
                longitude: listing.longitude,
                monthlyRent: listing.monthlyRent,
                suburb: listing.suburb,
                city: listing.city,
              }))}
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