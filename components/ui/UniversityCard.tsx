import Link from "next/link";
import { GraduationCap, MapPin } from "lucide-react";


type UniversityCardProps = {
  name: string;
  city: string;
  listings: number;
};

export default function UniversityCard({
  name,
  city,
  listings,
}: UniversityCardProps) {
  return (
    <Link
      href="/browse"
      className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#1C3769]/10">
        <GraduationCap className="h-7 w-7 text-[#1C3769]" />
      </div>

      <h3 className="text-xl font-bold text-slate-900">
        {name}
      </h3>

      <div className="mt-2 flex items-center gap-2 text-slate-500">
        <MapPin className="h-4 w-4" />
        <span>{city}</span>
      </div>

      <p className="mt-4 text-sm text-slate-600">
        {listings} Listings
      </p>

      <div className="mt-6 font-semibold text-[#1C3769] transition group-hover:translate-x-1">
        Browse →
      </div>
    </Link>
  );
}