import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/types/listing";
import { getAmenityIcon } from "@/lib/amenityIcons";
import FavoriteButton from "@/components/shared/FavoriteButton";
import { MapPin } from "lucide-react";

type ListingCardProps = {
  listing: Listing;
  source?: "browse" | "dashboard" | "saved";
  variant?: "default" | "spotlight";
};

export default function ListingCard({
  listing,
  source = "browse",
  variant = "default",
}: ListingCardProps) {
  const listingUrl = `/listings/${listing.id}?from=${source}`;
  const isSpotlight = variant === "spotlight";

  // Display the distance only when the API provides a valid value.
  const distance = listing.distanceToUniversityKm;

  const hasDistance =
    typeof distance === "number" &&
    Number.isFinite(distance) &&
    distance >= 0;

  const formattedDistance = hasDistance
    ? `${distance.toLocaleString(undefined, {
        maximumFractionDigits: 1,
      })} km from ${listing.university}`
    : null;

  return (
    <div
      className={`
        group flex h-full flex-col overflow-hidden
        rounded-3xl border border-border
        bg-surface text-text-primary
        transition-all duration-300
        ${
          isSpotlight
            ? "border-brand-blue/20 shadow-[0_12px_40px_rgba(30,58,138,0.10)] hover:-translate-y-2 hover:border-brand-blue/30 hover:shadow-[0_20px_50px_rgba(30,58,138,0.16)]"
            : "shadow-sm hover:-translate-y-1 hover:shadow-xl"
        }
      `}
    >
      {/* PROPERTY IMAGE */}
      <div className="relative overflow-hidden">
        <Link href={listingUrl}>
          <Image
            src={
              listing.images?.[0] ||
              "/images/listings/room2.png"
            }
            alt={listing.title}
            width={600}
            height={400}
            className={`
              w-full object-cover
              transition-transform duration-500
              group-hover:scale-[1.04]
              ${
                isSpotlight
                  ? "h-44 sm:h-52 md:h-60 lg:h-64"
                  : "h-40 md:h-56"
              }
            `}
          />
        </Link>

        {/* SPOTLIGHT BADGE */}
        {isSpotlight && (
          <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/20 bg-brand-blue px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white shadow-lg">
            <span className="text-sm">✦</span>
            Spotlight
          </div>
        )}

        {/* VERIFIED BADGE */}
        {listing.verified && (
          <div
            className={`
              absolute
              ${
                isSpotlight
                  ? "left-4 top-14"
                  : "left-3 top-3 md:left-4 md:top-4"
              }
              rounded-full bg-green-600 px-3 py-1
              text-[11px] font-bold uppercase tracking-wide
              text-white shadow-sm
            `}
          >
            ✓ Verified
          </div>
        )}

        {/* FAVORITE BUTTON */}
        <div className="absolute right-3 top-3 md:right-4 md:top-4">
          <FavoriteButton listingId={listing.id} />
        </div>
      </div>

      {/* CARD CONTENT */}
      <div
        className={`
          flex flex-1 flex-col
          ${isSpotlight ? "p-4 sm:p-5 md:p-6 lg:p-7" : "p-4 md:p-6"}
        `}
      >
        {/* PROPERTY TITLE */}
        <Link href={listingUrl}>
          <h3
            className={`
              font-bold text-text-primary
              transition-colors
              group-hover:text-brand-blue
              ${
                isSpotlight
                  ? "text-lg tracking-tight sm:text-xl md:text-[22px] lg:text-[23px]"
                  : "text-lg md:text-2xl"
              }
            `}
          >
            {listing.title}
          </h3>
        </Link>

        {/* UNIVERSITY */}
        <p
          className={`
            font-medium text-brand-blue dark:text-blue-400
            ${
              isSpotlight
                ? "mt-2"
                : "mt-1 text-sm md:mt-2 md:text-base"
            }
          `}
        >
          {listing.university}
        </p>

        {/* LOCATION */}
        <p
          className={`
            text-text-muted
            ${isSpotlight ? "" : "text-sm md:text-base"}
          `}
        >
          {listing.suburb}, {listing.city}
        </p>

        {/* DISTANCE TO UNIVERSITY */}
        {formattedDistance && (
          <p
            className={`
              mt-1.5 flex items-center gap-1.5
              text-xs font-medium text-text-muted
              sm:text-sm
            `}
            aria-label={`Approximately ${formattedDistance}`}
            title="Approximate distance to the associated university"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="shrink-0 text-brand-blue"
            >
              <circle cx="12" cy="10" r="3" />
              <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
            </svg>

            <span>{formattedDistance}</span>
          </p>
        )}

        {/* AMENITIES */}
        {listing.amenities?.length > 0 && (
          <div
            className={`
              flex flex-wrap gap-2
              ${isSpotlight ? "mt-5" : "mt-3 md:mt-5"}
            `}
          >
            {listing.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className={`
                  flex items-center gap-1
                  rounded-full px-3 py-1
                  text-xs font-medium
                  ${
                    isSpotlight
                      ? "border border-border bg-surface-secondary text-text-secondary"
                      : "bg-surface-tertiary text-brand-green-dark"
                  }
                `}
              >
                {getAmenityIcon(amenity)}
                {amenity}
              </span>
            ))}
          </div>
        )}

        {/* PRICE + BUTTON */}
          <div
            className={`
              mt-auto flex flex-wrap items-end justify-between gap-x-3 gap-y-4
              ${isSpotlight ? "pt-5 sm:pt-6 md:pt-7 lg:pt-8" : "pt-5 md:pt-6"}
            `}
          >
            {/* Monthly rent */}
            <div className="min-w-0 flex-1">
              <p
                className={`
                  whitespace-nowrap font-bold leading-tight text-brand-blue dark:text-white
                  ${
                    isSpotlight
                      ? "text-2xl tracking-tight sm:text-3xl md:text-[32px] lg:text-[34px]"
                      : "text-xl sm:text-2xl md:text-3xl"
                  }
                `}
              >
                US${listing.price}
              </p>

              <p className="mt-1 text-xs text-text-muted md:text-sm">
                per month
              </p>
            </div>

            {/* View details */}
            <Link
              href={listingUrl}
              className={`
                inline-flex shrink-0 items-center justify-center
                whitespace-nowrap rounded-xl font-semibold text-white
                transition-all
                ${
                  isSpotlight
                    ? "bg-brand-blue px-5 py-3.5 text-sm shadow-md hover:-translate-y-0.5 hover:bg-brand-blue-dark hover:shadow-lg sm:px-6"
                    : "bg-brand-blue px-3 py-3 text-xs hover:bg-brand-blue-dark sm:px-4 sm:text-sm md:px-5"
                }
              `}
            >
              View Details
            </Link>
          </div>
      </div>
    </div>
  );
}