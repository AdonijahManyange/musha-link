import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/types/listing";
import { getAmenityIcon } from "@/lib/amenityIcons";
import FavoriteButton from "@/components/shared/FavoriteButton";

export default function ListingCard({
  listing,
  source = "browse",
}: {
  listing: Listing;
  source?: "browse" | "dashboard" | "saved";
}) {
  const listingUrl = `/listings/${listing.id}?from=${source}`;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* =====================================================
          IMAGE
      ===================================================== */}

      <div className="relative overflow-hidden">
        <Link href={listingUrl}>
          <Image
            src={listing.images[0]}
            alt={listing.title}
            width={500}
            height={300}
            className="h-56 w-full object-cover transition duration-300 hover:scale-105"
          />
        </Link>

        {/* Verified */}

        {listing.verified && (
          <div className="absolute left-4 top-4 rounded-full bg-green-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            ✓ Verified
          </div>
        )}

        {/* Favorite */}

        <div className="absolute right-4 top-4">
          <FavoriteButton listingId={listing.id} />
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="flex flex-1 flex-col p-6">

        {/* Title */}

        <Link href={listingUrl}>
          <h3 className="text-2xl font-bold text-slate-900 transition hover:text-brand-blue">
            {listing.title}
          </h3>
        </Link>

        {/* University */}

        <p className="mt-2 font-medium text-brand-blue">
          {listing.university}
        </p>

        {/* Location */}

        <p className="text-slate-500">
          {listing.suburb}, {listing.city}
        </p>

        {/* =================================================
            AMENITIES
        ================================================= */}

        {listing.amenities?.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {listing.amenities
              .slice(0, 3)
              .map((amenity) => (
                <span
                  key={amenity}
                  className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-green-600"
                >
                  {getAmenityIcon(amenity)}
                  {amenity}
                </span>
              ))}
          </div>
        )}

        {/* =================================================
            PRICE + BUTTON
        ================================================= */}

        <div className="mt-auto flex items-end justify-between pt-6">

          <div>
            <p className="text-4xl font-bold text-brand-blue">
              US${listing.price}
            </p>

            <p className="text-sm text-slate-500">
              per month
            </p>
          </div>

          <Link
            href={listingUrl}
            className="rounded-xl bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark"
          >
            View Details
          </Link>

        </div>
      </div>
    </div>
  );
}