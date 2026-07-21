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
    description: "Every property is reviewed before it appears on MushaLink.",
  },
  {
    icon: BadgeCheck,
    title: "Trusted Landlords",
    description: "Verified landlord profiles help students avoid scams.",
  },
  {
    icon: MapPin,
    title: "Near Your Campus",
    description: "Find accommodation within walking distance of your university.",
  },
  {
    icon: MessageCircle,
    title: "Student Support",
    description: "Questions? We're here to help throughout your search.",
  },
];

export default function TrustSection() {
  return (
    <section 
      id="about"
      className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-14 text-center">
          <h2 className="text-4xl font-bold text-slate-900">
            Why Students Trust MushaLink
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Finding accommodation should be simple, safe and stress-free.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-8 transition hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                  <Icon className="h-7 w-7 text-green-600" />
                </div>

                <h3 className="mb-3 text-xl font-semibold text-slate-900">
                  {feature.title}
                </h3>

                <p className="text-slate-600">
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