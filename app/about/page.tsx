import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="bg-brand-blue text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">
            About Musha Link
          </p>

          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            Making student accommodation easier to find.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
            Musha Link helps students find accommodation near their
            universities while giving landlords a simple way to reach
            students looking for a place to call home.
          </p>
        </div>
      </section>

      {/* ======================================================
          MISSION
      ====================================================== */}

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-900">
              Our Mission
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Finding a place to live shouldn&apos;t be complicated.
            </h2>

            <p className="mt-6 leading-7 text-slate-600">
              Finding suitable student accommodation can be difficult,
              especially when you&apos;re moving to a new city or starting
              university for the first time.
            </p>

            <p className="mt-4 leading-7 text-slate-600">
              Musha Link brings student accommodation listings together
              in one place, making it easier to search by university,
              location, room type, and budget.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
              🏠
            </div>

            <h3 className="mt-6 text-xl font-bold text-slate-900">
              Built for students
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
              Search accommodation based on the things that actually
              matter when choosing a student home.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================
          HOW IT WORKS
      ====================================================== */}

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-900">
              How Musha Link Works
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Find your next home in a few steps.
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="rounded-2xl bg-slate-50 p-7">
              <div className="text-3xl">🎓</div>

              <h3 className="mt-6 text-lg font-bold text-slate-900">
                Choose your university
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Find your university and explore accommodation located
                nearby.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl bg-slate-50 p-7">
              <div className="text-3xl">🔎</div>

              <h3 className="mt-6 text-lg font-bold text-slate-900">
                Compare listings
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Browse available homes and narrow your search by price,
                room type, and other preferences.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl bg-slate-50 p-7">
              <div className="text-3xl">🏡</div>

              <h3 className="mt-6 text-lg font-bold text-slate-900">
                Find your home
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Choose a place that fits your needs and connect with the
                landlord.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          LANDLORD CTA
      ====================================================== */}

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="rounded-3xl bg-slate-950 px-8 py-12 text-white md:px-12">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">
              For Landlords
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Have student accommodation available?
            </h2>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
              List your property on Musha Link and connect with students
              searching for accommodation near their university.
            </p>

            <div className="mt-8">
              <Link
                href="/dashboard"
                className="inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                List Your Property
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}