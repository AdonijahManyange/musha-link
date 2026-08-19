import UniversityCard from "@/components/ui/UniversityCard";

export default function Universities() {
  return (
    <section
      id="universities"
      className="bg-slate-50 py-24"
    >
      <div className="mx-auto max-w-6xl px-6">

        {/* Section Header */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-blue">
            Find Your University
          </p>

          <h2 className="mt-2 text-4xl font-bold text-slate-900">
            Browse by University
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Find student accommodation close to Zimbabwe's leading universities.
          </p>
        </div>

        {/* University Cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          <UniversityCard
            name="Africa University"
            city="Mutare"
            description="Find student accommodation near Africa University."
            logo="/images/universities/africa-university.jpeg"
            href="/browse?university=Africa%20University"
          />

          <UniversityCard
            name="University of Zimbabwe"
            city="Harare"
            description="Explore accommodation options around UZ."
            logo="/images/universities/uz.jpeg"
            href="/browse?university=University%20of%20Zimbabwe"
          />

          <UniversityCard
            name="NUST"
            city="Bulawayo"
            description="Find accommodation close to NUST."
            logo="/images/universities/nust.png"
            href="/browse?university=NUST"
          />

          <UniversityCard
            name="MSUAS"
            city="Mutare"
            description="Browse student accommodation around MSUAS."
            logo="/images/universities/msuas.png"
            href="/browse?university=MSUAS"
          />

        </div>

        {/* Browse Everything */}
        <div className="mt-10 flex justify-center">
          <a
            href="/browse"
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Browse All Listings
          </a>
        </div>

      </div>
    </section>
  );
}