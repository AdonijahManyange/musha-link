import Image from "next/image";
import { Wifi, Zap, Droplets, BadgeCheck } from "lucide-react";

type Listing = {
  title: string;
  university: string;
  city: string;
  price: number;
  image: string;
  verified: boolean;
  solar: boolean;
  WaterSupply: boolean;
  wifi: boolean;
};

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-2 hover:shadow-xl">

      <div className="relative h-60">
        <Image
          src={listing.image}
          alt={listing.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-6">

        {listing.verified && (
          <div className="mb-4 flex items-center gap-2 text-green-600">
            <BadgeCheck size={18} />
            <span className="text-sm font-medium">
              Verified Listing
            </span>
          </div>
        )}

        <h3 className="text-2xl font-bold text-slate-900">
          {listing.title}
        </h3>

        <p className="mt-2 text-slate-600">
          {listing.university}
        </p>

        <p className="text-slate-500">
          {listing.city}
        </p>

        <div className="mt-5 flex flex-wrap gap-3">

            {listing.solar && (
                <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                <Zap size={16} />
                <span>Solar</span>
                </div>
            )}

            {listing.WaterSupply && (
                <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                <Droplets size={16} />
                <span>Water Supply</span>
                </div>
            )}

            {listing.wifi && (
                <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                <Wifi size={16} />
                <span>Wi-Fi</span>
                </div>
            )}

        </div>

        <div className="mt-6 flex items-center justify-between">

          <span className="text-3xl font-bold text-[#1C3769]">
            US${listing.price}
            <span className="text-base text-slate-500">
              /month
            </span>
          </span>

          <button className="rounded-xl bg-[#1C3769] px-5 py-3 font-semibold text-white transition hover:bg-[#162D57]">
            View Details
          </button>

        </div>

      </div>

    </div>
  );
}