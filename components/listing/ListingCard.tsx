import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/types/listing";
import { getAmenityIcon } from "@/lib/amenityIcons";
import FavoriteButton from "@/components/shared/FavoriteButton";

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

  return (
    <div
      className={`
        group
        flex h-full flex-col overflow-hidden
        rounded-3xl
        bg-white
        transition-all duration-300
        ${
          isSpotlight
            ? "border border-brand-blue/20 shadow-[0_12px_40px_rgba(30,58,138,0.10)] hover:-translate-y-2 hover:border-brand-blue/30 hover:shadow-[0_20px_50px_rgba(30,58,138,0.16)]"
            : "border border-slate-200 shadow-sm hover:-translate-y-1 hover:shadow-xl"
        }
      `}
    >

      {/* =====================================================
          IMAGE
      ===================================================== */}

      <div className="relative overflow-hidden">

        <Link href={listingUrl}>
          <Image
            src={listing.images[0]}
            alt={listing.title}
            width={600}
            height={400}
            className={`
              w-full object-cover
              transition-transform duration-500
              group-hover:scale-[1.04]
              ${
                isSpotlight
                  ? "h-64"
                  : "h-56"
              }
            `}
          />
        </Link>

        {/* =================================================
            SPOTLIGHT BADGE
        ================================================= */}

        {isSpotlight && (
          <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/20 bg-brand-blue px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white shadow-lg">
            <span className="text-sm">✦</span>
            Spotlight
          </div>
        )}

        {/* =================================================
            VERIFIED BADGE
        ================================================= */}

        {listing.verified && (
          <div
            className={`
              absolute
              ${
                isSpotlight
                  ? "left-4 top-14"
                  : "left-4 top-4"
              }
              rounded-full
              bg-green-600
              px-3 py-1
              text-[11px]
              font-bold
              uppercase
              tracking-wide
              text-white
              shadow-sm
            `}
          >
            ✓ Verified
          </div>
        )}

        {/* =================================================
            FAVORITE
        ================================================= */}

        <div className="absolute right-4 top-4">
          <FavoriteButton listingId={listing.id} />
        </div>

      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div
        className={`
          flex flex-1 flex-col
          ${
            isSpotlight
              ? "p-7"
              : "p-6"
          }
        `}
      >

        {/* =================================================
            TITLE
        ================================================= */}

        <Link href={listingUrl}>
          <h3
            className={`
              font-bold text-slate-900
              transition-colors
              group-hover:text-brand-blue
              ${
                isSpotlight
                  ? "text-[23px] tracking-tight"
                  : "text-2xl"
              }
            `}
          >
            {listing.title}
          </h3>
        </Link>

        {/* =================================================
            UNIVERSITY
        ================================================= */}

        <p className="mt-2 font-medium text-brand-blue">
          {listing.university}
        </p>

        {/* =================================================
            LOCATION
        ================================================= */}

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
                  className={`
                    flex items-center gap-1
                    rounded-full
                    px-3 py-1
                    text-xs
                    font-medium
                    ${
                      isSpotlight
                        ? "border border-slate-200 bg-slate-50 text-slate-600"
                        : "bg-slate-100 text-green-600"
                    }
                  `}
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

        <div
          className={`
            mt-auto
            flex items-end justify-between
            ${
              isSpotlight
                ? "pt-8"
                : "pt-6"
            }
          `}
        >

          <div>
            <p
              className={`
                font-bold text-brand-blue
                ${
                  isSpotlight
                    ? "text-[34px] tracking-tight"
                    : "text-4xl"
                }
              `}
            >
              US${listing.price}
            </p>

            <p className="text-sm text-slate-500">
              per month
            </p>
          </div>

          <Link
            href={listingUrl}
            className={`
              rounded-xl
              font-semibold
              text-white
              transition-all
              ${
                isSpotlight
                  ? "bg-brand-blue px-6 py-3.5 text-sm shadow-md hover:-translate-y-0.5 hover:bg-brand-blue-dark hover:shadow-lg"
                  : "bg-brand-blue px-6 py-3 text-sm hover:bg-brand-blue-dark"
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