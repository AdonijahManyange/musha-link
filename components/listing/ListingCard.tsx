import Image from "next/image";
import Link from "next/link";

type Listing = {
  id: number;
  slug: string;
  title: string;
  university: string;
  suburb: string;
  city: string;
  roomType: string;
  price: number;
  images: string[];
  description: string;
  amenities: string[];
  featured: boolean;
  verified: boolean;
};

export default function ListingCard({
  listing,
}: {
  listing: Listing;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div className="relative">
        <Image
          src={listing.images[0]}
          alt={listing.title}
          width={500}
          height={300}
          className="h-56 w-full object-cover"
        />

        {listing.verified && (
          <div className="absolute left-4 top-4 rounded-full bg-green-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            ✓ Verified
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">

        <h3 className="text-2xl font-bold text-slate-900">
          {listing.title}
        </h3>

        <p className="mt-2 font-medium text-brand-blue">
          {listing.university}
        </p>

        <p className="text-slate-500">
          {listing.suburb}, {listing.city}
        </p>

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
            href={`/listing/${listing.slug}`}
            className="rounded-xl bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark"
          >
            View Details
          </Link>

        </div>

      </div>

    </div>
  );
}