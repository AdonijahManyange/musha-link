import UniversityCard from "@/components/ui/UniversityCard";
import { prisma } from "@/lib/prisma";

export default async function Universities() {
  const universities = await prisma.university.findMany({
    where: {
      name: {
        in: [
          "Africa University",
          "University of Zimbabwe",
          "National University of Science and Technology",
          "National University of Science and Technology (NUST)",
          "Midlands State University",
        ],
      },
    },
  });

  const findUniversity = (...names: string[]) =>
    universities.find((university) =>
      names.includes(university.name)
    );

  const africaUniversity =
    findUniversity("Africa University");

  const universityOfZimbabwe =
    findUniversity("University of Zimbabwe");

  const nust = findUniversity(
    "National University of Science and Technology (NUST)",
    "National University of Science and Technology"
  );

  const msuas =
    findUniversity("Midlands State University");

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
        <div className="mt-14">

          {/* Mobile Swipe Hint */}
          <div className="mb-4 flex items-center justify-between md:hidden">
            <p className="text-sm font-medium text-slate-500">
              Swipe to explore universities
            </p>

            <span className="text-sm text-slate-400">
              ← →
            </span>
          </div>

          {/* Mobile Carousel / Desktop Grid */}
          <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-4">

            {africaUniversity && (
              <div className="min-w-[85%] snap-start md:min-w-0">
                <UniversityCard
                  name="Africa University"
                  city="Mutare"
                  description="Find student accommodation near Africa University."
                  logo="/images/universities/africa-university.jpeg"
                  href={`/browse?university=${encodeURIComponent(
                    africaUniversity.id
                  )}`}
                />
              </div>
            )}

            {universityOfZimbabwe && (
              <div className="min-w-[85%] snap-start md:min-w-0">
                <UniversityCard
                  name="University of Zimbabwe"
                  city="Harare"
                  description="Explore accommodation options around UZ."
                  logo="/images/universities/uz.png"
                  href={`/browse?university=${encodeURIComponent(
                    universityOfZimbabwe.id
                  )}`}
                />
              </div>
            )}

            {nust && (
              <div className="min-w-[85%] snap-start md:min-w-0">
                <UniversityCard
                  name="NUST"
                  city="Bulawayo"
                  description="Find accommodation close to NUST."
                  logo="/images/universities/nust1.png"
                  href={`/browse?university=${encodeURIComponent(
                    nust.id
                  )}`}
                />
              </div>
            )}

            {msuas && (
              <div className="min-w-[85%] snap-start md:min-w-0">
                <UniversityCard
                  name="MSUAS"
                  city="Mutare"
                  description="Browse student accommodation around MSUAS."
                  logo="/images/universities/msuas.png"
                  href={`/browse?university=${encodeURIComponent(
                    msuas.id
                  )}`}
                />
              </div>
            )}

          </div>
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