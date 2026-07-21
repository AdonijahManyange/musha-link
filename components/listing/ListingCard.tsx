import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

type Listing = {
  id: number;
  slug: string;
  title: string;
  university: string;
  suburb: string;
  city: string;
  roomType: string;
  price: number;
  image: string;
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
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      <Image
        src={listing.image}
        alt={listing.title}
        width={500}
        height={300}
        className="h-56 w-full object-cover"
      />

      <div className="p-5">

        {listing.verified && (
          <div className="mb-3 flex items-center gap-2 text-green-600">
            <ShieldCheck size={18} />
            <span className="text-sm font-medium">
              Verified Listing
            </span>
          </div>
        )}

        <h3 className="text-3xl font-bold text-slate-900">
          {listing.title}
        </h3>

        <p className="mt-2 font-medium text-brand-blue">
          {listing.university}
        </p>

        <p className="text-slate-500">
          {listing.suburb}, {listing.city}
        </p>

        <div className="mt-6 flex items-center justify-between">

          <div>
            <span className="text-4xl font-bold text-brand-blue">
              US${listing.price}
            </span>

            <span className="text-slate-500">
              /month
            </span>
          </div>

          <Link
            href={`/listing/${listing.slug}`}
            className="rounded-xl bg-brand-blue px-6 py-3 font-semibold text-white transition hover:bg-brand-blue-dark"
          >
            View Details
          </Link>

        </div>

      </div>

    </div>
  );
}