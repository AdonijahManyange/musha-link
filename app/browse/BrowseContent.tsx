"use client";

import { filterListings } from "@/lib/filters";
import ListingCard from "@/components/listing/ListingCard";
import SearchBar from "@/components/home/SearchBar";
import { useRouter, useSearchParams } from "next/navigation";

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const filters = {
  university: searchParams.get("university") || undefined,
  roomType: searchParams.get("roomType") || undefined,
  budget: searchParams.get("budget") || undefined,
};
  const filteredListings =
  filterListings(filters);

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="text-5xl font-bold tracking-tight text-slate-900">
        Browse Accommodation
      </h1>

      <p className="mt-3 max-w-2xl text-lg text-slate-600">
        Find verified student accommodation near your university across Zimbabwe.
      </p>

      <div className="mt-10 rounded-3xl bg-white p-6 shadow-lg">
        <SearchBar />
      </div>

      <div className="mt-14 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">
          {filteredListings.length} Listings Found
        </h2>

        {(filters.university || filters.budget || filters.roomType) && (
          <button
            type="button"
            onClick={() => {
              console.log("Before:", window.location.href);

              router.replace("/browse");

              setTimeout(() => {
                console.log("After:", window.location.href);
              }, 300);
            }}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Listings Grid */}

      <div className="mt-8 grid gap-10 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-500">
        {filteredListings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
          />
        ))}
      </div>
    </main>
  );
}