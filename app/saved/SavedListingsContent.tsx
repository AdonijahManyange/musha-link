"use client";

import { useEffect, useState } from "react";

import { getFavorites } from "@/lib/favorites";
import ListingCard from "@/components/listing/ListingCard";

type SavedListing = {
  id: string;
  title: string;
  monthlyRent: number;
  suburb: string | null;
  city: string;
  roomType: string;
  description: string;
  amenities: string[];
  university: {
    name: string;
  } | null;
  landlord: {
    name: string | null;
    email: string;
    landlordProfile: {
      phone: string | null;
    } | null;
  };
  photos: {
    id: string;
    url: string;
  }[];
  status: string;
  isActive: boolean;
};

export default function SavedListingsContent() {
  const [savedListings, setSavedListings] = useState<
    SavedListing[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSavedListings() {
      const favoriteIds = getFavorites();

      if (favoriteIds.length === 0) {
        setSavedListings([]);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/listings?ids=${favoriteIds.join(",")}`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load saved listings."
          );
        }

        const data = await response.json();

        setSavedListings(data);
      } catch (error) {
        console.error(
          "Failed to load saved listings:",
          error
        );

        setSavedListings([]);
      } finally {
        setLoading(false);
      }
    }

    loadSavedListings();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">

      <h1 className="text-5xl font-bold text-slate-900">
        Saved Listings
      </h1>

      <p className="mt-3 text-lg text-slate-600">
        View all the accommodation you've saved.
      </p>

      {loading ? (
        <div className="mt-20 text-center text-slate-500">
          Loading saved listings...
        </div>
      ) : savedListings.length === 0 ? (
        <div className="mt-20 rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center">

          <h2 className="text-2xl font-semibold text-slate-900">
            No saved listings yet
          </h2>

          <p className="mt-4 text-slate-500">
            Tap the ❤️ icon on any listing to save it
            for later.
          </p>

        </div>
      ) : (
        <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {savedListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={{
                id: listing.id,
                slug: listing.id,
                title: listing.title,
                university:
                  listing.university?.name ?? "University",
                suburb: listing.suburb ?? "",
                city: listing.city,
                roomType: listing.roomType,
                price: listing.monthlyRent,
                images:
                  listing.photos.length > 0
                    ? listing.photos.map(
                        (photo) => photo.url
                      )
                    : ["/images/placeholder.jpg"],
                description: listing.description,
                amenities: listing.amenities,
                featured: false,
                verified: false,
                landlord: {
                  name: listing.landlord.name ?? "Landlord",
                  phone:
                    listing.landlord.landlordProfile?.phone ?? "",
                  email: listing.landlord.email,
                },
              }}
              source="saved"
            />
          ))}
        </div>
      )}

    </div>
  );
}