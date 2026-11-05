import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, Search, Users } from "lucide-react";
import PublicSiteLayout from "@/components/layout/PublicSiteLayout";

export const metadata: Metadata = {
  title: "About Us | MushaLink",
  description:
    "Learn about MushaLink, a platform helping students find accommodation near universities across Zimbabwe and helping landlords reach student renters.",
  alternates: {
    canonical: "https://mushalink.com/about",
  },
};

const pillars = [
  {
    icon: Search,
    title: "A clearer search",
    description:
      "Browse student accommodation in one place and compare options by university, location, room type, and budget.",
  },
  {
    icon: BadgeCheck,
    title: "Trust through review",
    description:
      "Landlord identity and property information can be reviewed through MushaLink’s verification process, giving students more context as they decide.",
  },
  {
    icon: Users,
    title: "A direct connection",
    description:
      "Students can contact landlords and arrange viewing requests through the platform, helping both sides take the next step.",
  },
];

export default function AboutPage() {
  return (
    <PublicSiteLayout>
      <main className="flex-1 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
        <section className="bg-gradient-to-br from-[#183568] via-[#23477f] to-[#2d5791] text-white">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">
              About MushaLink
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Helping students find a place to call home.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              MushaLink connects students looking for accommodation in Zimbabwe
              with landlords offering places to live near their universities.
              We bring listings, search tools, and ways to connect together in
              one place.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/browse"
                className="inline-flex items-center gap-2 rounded-xl bg-[#ffffff] px-5 py-3 font-semibold text-[#183568] transition hover:bg-[#eff6ff]"
              >
                Browse accommodation <ArrowRight size={18} />
              </Link>
              <Link
                href="/universities"
                className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Explore universities
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">
              Why we’re here
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Finding accommodation should feel more straightforward.
            </h2>
            <p className="mt-6 leading-8 text-slate-600 dark:text-slate-300">
              Starting university or moving to a new city comes with enough
              decisions. Finding somewhere to live can mean searching across
              scattered posts, comparing details that are hard to confirm, and
              trying to reach the right person.
            </p>
            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-300">
              MushaLink is designed to make that search easier to navigate. It
              gives students a place to discover accommodation and gives
              landlords a way to present their properties to people looking for
              student housing.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              <MapPin size={24} />
            </div>
            <h3 className="mt-5 text-xl font-bold">Built around student life</h3>
            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
              Search with the details that matter when choosing a student home,
              including the university you’ll attend, where you want to live,
              and what fits your budget.
            </p>
            <Link
              href="/universities"
              className="mt-5 inline-flex items-center gap-2 font-semibold text-blue-800 hover:underline dark:text-blue-300"
            >
              Find accommodation near a university <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900 md:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">
                What we focus on
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Useful tools for students and landlords.
              </h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {pillars.map(({ icon: Icon, title, description }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-5 text-lg font-bold">{title}</h3>
                  <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="rounded-3xl bg-[#1d3b70] px-7 py-10 text-white md:flex md:items-center md:justify-between md:px-12 md:py-12">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold sm:text-3xl">
                Looking for your next student home?
              </h2>
              <p className="mt-3 leading-7 text-blue-100">
                Start exploring accommodation and connect with landlords on
                MushaLink.
              </p>
            </div>
            <Link
              href="/browse"
              className="mt-6 inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#ffffff] px-5 py-3 font-semibold text-[#183568] transition hover:bg-[#eff6ff] md:mt-0"
            >
              Start browsing <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
    </PublicSiteLayout>
  );
}
