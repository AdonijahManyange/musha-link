"use client";

import { filterListings } from "@/lib/filters";
import ListingCard from "@/components/listing/ListingCard";
import { useSearchParams } from "next/navigation";

export default function BrowsePage() {
  const searchParams = useSearchParams();

  const university = searchParams.get("university");
  const budget = searchParams.get("budget");
  const roomType = searchParams.get("roomType");
  const filteredListings = filterListings({
    university: university || undefined,
    roomType: roomType || undefined,
    budget: budget || undefined,
  });

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="text-4xl font-bold">
        Browse Accommodation
      </h1>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">
            {filteredListings.length} Listings Found
        </h2>

        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredListings.map((listing) => (
            <ListingCard
                key={listing.id}
                listing={listing}
            />
            ))}
         </div>
      </div>
    </main>
  );
}