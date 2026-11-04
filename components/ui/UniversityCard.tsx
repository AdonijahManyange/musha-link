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
        university-card-surface flex h-full flex-col rounded-2xl
        border border-slate-200 p-5 shadow-sm
        transition-all duration-200
        hover:-translate-y-1 hover:shadow-md
        dark:border-slate-300 dark:shadow-black/20 dark:hover:shadow-black/30
      "
    >
      {/* Logo */}
      <div
        className="
          university-logo-plaque flex h-28 items-center justify-center rounded-xl border border-slate-200 p-4
          transition-colors duration-200
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
            university-card-title text-lg font-bold leading-6
            transition-colors duration-200
          "
        >
          {name}
        </h3>

        {/* City */}
        <p
          className="
            university-card-city mt-3 text-sm font-medium text-brand-blue
          "
        >
          {city}
        </p>

        {/* Description */}
        <p
          className="
            university-card-description mt-3 text-sm leading-6
            transition-colors duration-200
          "
        >
          {description}
        </p>

        {/* CTA */}
        <div
          className="
            mt-auto border-t border-slate-100 pt-4
            dark:border-slate-300
          "
        >
          <Link
            href={href}
            className="
              university-card-link text-sm font-semibold
              transition-colors duration-200
              hover:text-brand-blue
            "
          >
            View accommodation →
          </Link>
        </div>
      </div>
    </div>
  );
}
