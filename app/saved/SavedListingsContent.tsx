"use client";

import { useEffect, useState } from "react";

import { listings } from "@/lib/listings";
import { getFavorites } from "@/lib/favorites";
import ListingCard from "@/components/listing/ListingCard";

export default function SavedListingsContent() {
  const [favoriteIds, setFavoriteIds] =
    useState<string[]>([]);

  useEffect(() => {
    setFavoriteIds(getFavorites());
  }, []);

  const savedListings = listings.filter((listing) =>
    favoriteIds.includes(String(listing.id))
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">

      <h1 className="text-5xl font-bold text-slate-900">
        Saved Listings
      </h1>

      <p className="mt-3 text-lg text-slate-600">
        View all the accommodation you've saved.
      </p>

      {savedListings.length === 0 ? (
        <div className="mt-20 rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center">

          <h2 className="text-2xl font-semibold text-slate-900">
            No saved listings yet
          </h2>

          <p className="mt-4 text-slate-500">
            Tap the ❤️ icon on any listing to save it for later.
          </p>

        </div>
      ) : (
        <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {savedListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={{
                ...listing,
                id: String(listing.id),
              }}
            />
          ))}
        </div>
      )}

    </div>
  );
}