import {
  ShieldCheck,
  BadgeCheck,
  MapPin,
  MessageCircle,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Listings",
    description:
      "Every property is reviewed before it appears on MushaLink.",
  },
  {
    icon: BadgeCheck,
    title: "Trusted Landlords",
    description:
      "Verified landlord profiles help students avoid scams.",
  },
  {
    icon: MapPin,
    title: "Near Your Campus",
    description:
      "Find accommodation within walking distance of your university.",
  },
  {
    icon: MessageCircle,
    title: "Student Support",
    description:
      "Questions? We're here to help throughout your search.",
  },
];

export default function TrustSection() {
  return (
    <section
      id="about"
      className="
        bg-white py-20
        transition-colors duration-200
        dark:bg-slate-950
      "
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Section Header */}
        <div className="mb-14 text-center">
          <h2
            className="
              text-3xl font-bold text-slate-900
              transition-colors duration-200
              dark:text-white sm:text-4xl
            "
          >
            Why Students Trust MushaLink
          </h2>

          <p
            className="
              mt-4 text-lg text-slate-600
              transition-colors duration-200
              dark:text-slate-300
            "
          >
            Finding accommodation should be simple, safe and stress-free.
          </p>
        </div>

        {/* =====================================================
            MOBILE — HORIZONTAL SWIPE
        ===================================================== */}

        <div
          className="
            -mx-6 flex snap-x snap-mandatory gap-4
            overflow-x-auto px-6 pb-4 scrollbar-hide
            md:hidden
          "
        >
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="
                  w-[82vw] min-w-[82vw] snap-start
                  rounded-2xl border border-slate-200
                  bg-slate-50 p-7 shadow-sm
                  transition-colors duration-200
                  dark:border-slate-700 dark:bg-slate-800
                "
              >
                {/* Icon */}
                <div
                  className="
                    mb-6 flex h-14 w-14 items-center
                    justify-center rounded-full bg-blue-100
                    transition-colors duration-200
                    dark:bg-slate-700
                  "
                >
                  <Icon className="h-7 w-7 text-green-600 dark:text-green-400" />
                </div>

                {/* Title */}
                <h3
                  className="
                    mb-3 text-xl font-semibold text-slate-900
                    transition-colors duration-200
                    dark:text-white
                  "
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className="
                    text-slate-600 transition-colors duration-200
                    dark:text-slate-300
                  "
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* =====================================================
            DESKTOP — FOUR-COLUMN GRID
        ===================================================== */}

        <div className="hidden gap-8 md:grid md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="
                  rounded-2xl border border-slate-200
                  bg-slate-50 p-8
                  transition-all duration-200
                  hover:-translate-y-2 hover:shadow-xl
                  dark:border-slate-700 dark:bg-slate-800
                  dark:shadow-black/10
                  dark:hover:shadow-black/30
                "
              >
                {/* Icon */}
                <div
                  className="
                    mb-6 flex h-14 w-14 items-center
                    justify-center rounded-full bg-blue-100
                    transition-colors duration-200
                    dark:bg-slate-700
                  "
                >
                  <Icon className="h-7 w-7 text-green-600 dark:text-green-400" />
                </div>

                {/* Title */}
                <h3
                  className="
                    mb-3 text-xl font-semibold text-slate-900
                    transition-colors duration-200
                    dark:text-white
                  "
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className="
                    text-slate-600 transition-colors duration-200
                    dark:text-slate-300
                  "
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}