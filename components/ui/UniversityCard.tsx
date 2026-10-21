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
    <div
      className="
        flex h-full flex-col rounded-2xl
        border border-slate-200 bg-white p-5 shadow-sm
        transition-all duration-200
        hover:-translate-y-1 hover:shadow-md
        dark:border-slate-700 dark:bg-slate-800
        dark:shadow-black/20 dark:hover:shadow-black/30
      "
    >
      {/* Logo */}
      <div
        className="
          flex h-28 items-center justify-center
          rounded-xl bg-slate-50 p-4
          transition-colors duration-200
          dark:bg-slate-700
        "
      >
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
        {/* University Name */}
        <h3
          className="
            text-lg font-bold leading-6 text-slate-900
            transition-colors duration-200
            dark:text-white
          "
        >
          {name}
        </h3>

        {/* City */}
        <p
          className="
            mt-3 text-sm font-medium text-brand-blue
            dark:text-blue-400
          "
        >
          {city}
        </p>

        {/* Description */}
        <p
          className="
            mt-3 text-sm leading-6 text-slate-600
            transition-colors duration-200
            dark:text-slate-300
          "
        >
          {description}
        </p>

        {/* CTA */}
        <div
          className="
            mt-auto border-t border-slate-100 pt-4
            dark:border-slate-700
          "
        >
          <Link
            href={href}
            className="
              text-sm font-semibold text-slate-700
              transition-colors duration-200
              hover:text-brand-blue
              dark:text-slate-200 dark:hover:text-blue-400
            "
          >
            View accommodation →
          </Link>
        </div>
      </div>
    </div>
  );
}