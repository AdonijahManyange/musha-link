import Image from "next/image";
import Link from "next/link";

type UniversityCardProps = {
  name: string;
  city: string;
  description: string;
  logo: string;
  href: string;
};

export default function UniversityCard({
  name,
  city,
  description,
  logo,
  href,
}: UniversityCardProps) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

      {/* Logo */}
      <div className="flex h-28 items-center justify-center rounded-xl bg-slate-50 p-4">
        <Image
          src={logo}
          alt={`${name} logo`}
          width={180}
          height={100}
          className="h-24 w-auto object-contain"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col pt-5">

        <h3 className="text-lg font-bold leading-6 text-slate-900">
          {name}
        </h3>

        <p className="mt-3 text-sm font-medium text-brand-blue">
          {city}
        </p>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          {description}
        </p>

        {/* CTA */}
        <div className="mt-auto border-t border-slate-100 pt-4">
          <Link
            href={href}
            className="text-sm font-semibold text-slate-700 transition hover:text-brand-blue"
          >
            View accommodation →
          </Link>
        </div>

      </div>
    </div>
  );
}