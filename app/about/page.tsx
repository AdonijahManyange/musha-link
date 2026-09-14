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

          {/* ==================================================
              MOBILE: HORIZONTAL SLIDER
              DESKTOP: ORIGINAL 3-COLUMN GRID
          ================================================== */}

          <div
            className="
              mt-12
              flex gap-5 overflow-x-auto pb-4
              snap-x snap-mandatory
              scrollbar-hide
              md:grid md:grid-cols-3 md:gap-8
              md:overflow-visible
              md:pb-0
            "
          >
            {/* Step 1 */}
            <div
              className="
                min-w-[85%] snap-center
                rounded-2xl bg-slate-50 p-7
                md:min-w-0
              "
            >
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
            <div
              className="
                min-w-[85%] snap-center
                rounded-2xl bg-slate-50 p-7
                md:min-w-0
              "
            >
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
            <div
              className="
                min-w-[85%] snap-center
                rounded-2xl bg-slate-50 p-7
                md:min-w-0
              "
            >
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
          PLANS & PRICING
      ====================================================== */}

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">

          {/* Header */}

          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-900">
              Simple Plans. Real Opportunities.
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Plans built for students and landlords.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Start free, upgrade when you need more, and choose the
              tools that work best for you.
            </p>
          </div>

          {/* ==================================================
              STUDENT PLANS
          ================================================== */}

          <div className="mt-14">

            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-900">
                🎓 For Students
              </p>

              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                Search smarter. Find your perfect student accommodation.
              </h3>
            </div>

            <div className="grid gap-6 md:grid-cols-2">

              {/* FREE */}

              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

                <div className="flex items-start justify-between gap-6">

                  <div>
                    <h4 className="text-2xl font-bold text-slate-900">
                      Free
                    </h4>

                    <p className="mt-1 text-sm text-slate-500">
                      Everything you need to get started.
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-4xl font-bold text-slate-900">
                      $0
                    </p>

                    <p className="text-sm text-slate-500">
                      /month
                    </p>
                  </div>

                </div>

                <ul className="mt-7 space-y-3 text-sm text-slate-600">
                  <li>✓ Search all accommodation</li>
                  <li>✓ View property details and photos</li>
                  <li>✓ Contact landlords</li>
                  <li>✓ Save your favourite listings</li>
                  <li>✓ Use filters for price, location, university, and more</li>
                </ul>

                <Link
                  href="/auth/signup"
                  className="mt-8 block rounded-xl border border-brand-blue px-5 py-3 text-center text-sm font-semibold text-brand-blue transition hover:bg-blue-50"
                >
                  Get Started Free
                </Link>

              </div>

              {/* STUDENT PLUS */}

              <div className="relative rounded-3xl border border-brand-blue/20 bg-blue-50 p-7 shadow-sm">

                <div className="absolute left-0 right-0 top-0 rounded-t-3xl bg-brand-blue px-4 py-2 text-center text-xs font-bold uppercase tracking-wide text-white">
                  Most Popular
                </div>

                <div className="pt-5">

                  <div className="flex items-start justify-between gap-6">

                    <div>
                      <h4 className="text-2xl font-bold text-slate-900">
                        Student Plus
                      </h4>

                      <p className="mt-1 text-sm text-slate-600">
                        Be the first to know.
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-4xl font-bold text-slate-900">
                        $2
                      </p>

                      <p className="text-sm text-slate-500">
                        /month
                      </p>
                    </div>

                  </div>

                  <ul className="mt-7 space-y-3 text-sm text-slate-700">
                    <li>✓ Everything in Free</li>
                    <li>✓ Instant notifications for matching properties</li>
                    <li>✓ Saved searches</li>
                    <li>✓ Early access to new listings</li>
                    <li>✓ Price-drop alerts</li>
                    <li>✓ Availability alerts</li>
                    <li>✓ Priority support</li>
                  </ul>

                  <button
                    type="button"
                    disabled
                    className="mt-8 block w-full cursor-not-allowed rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white opacity-70"
                  >
                    Coming Soon
                  </button>

                </div>

              </div>

            </div>
          </div>

          {/* ==================================================
              LANDLORD PLANS
          ================================================== */}

          <div className="mt-16">

            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-900">
                🏠 For Landlords
              </p>

              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                List your property. Reach more students. Fill your rooms faster.
              </h3>
            </div>

            <div className="grid gap-6 md:grid-cols-3">

              {/* STANDARD */}

              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">
                      Standard Listing
                    </h4>

                    <p className="mt-1 text-sm text-slate-500">
                      Get your property online.
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-3xl font-bold text-slate-900">
                      $6
                    </p>

                    <p className="text-xs text-slate-500">
                      /month
                    </p>
                  </div>
                </div>

                <ul className="mt-7 space-y-3 text-sm text-slate-600">
                  <li>✓ List 1 property</li>
                  <li>✓ Add photos and description</li>
                  <li>✓ Receive student enquiries</li>
                  <li>✓ Standard search placement</li>
                  <li>✓ Manage your listing</li>
                  <li>✓ Basic listing analytics</li>
                </ul>

                <Link
                  href="/auth/signup"
                  className="mt-8 block rounded-xl border border-brand-blue px-5 py-3 text-center text-sm font-semibold text-brand-blue transition hover:bg-blue-50"
                >
                  Get Started
                </Link>

              </div>

              {/* PRO */}

              <div className="relative rounded-3xl border border-brand-blue/20 bg-blue-50 p-7 shadow-sm">

                <div className="absolute left-0 right-0 top-0 rounded-t-3xl bg-brand-blue px-4 py-2 text-center text-xs font-bold uppercase tracking-wide text-white">
                  Popular
                </div>

                <div className="pt-5">

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <h4 className="text-xl font-bold text-slate-900">
                        Pro
                      </h4>

                      <p className="mt-1 text-sm text-slate-600">
                        More visibility. More enquiries.
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-3xl font-bold text-slate-900">
                        $10
                      </p>

                      <p className="text-xs text-slate-500">
                        /month
                      </p>
                    </div>

                  </div>

                  <ul className="mt-7 space-y-3 text-sm text-slate-700">
                    <li>✓ Everything in Standard</li>
                    <li>✓ Featured listing badge</li>
                    <li>✓ Higher search position</li>
                    <li>✓ More photos and videos</li>
                    <li>✓ Listing analytics</li>
                    <li>✓ Priority support</li>
                  </ul>

                  <button
                    type="button"
                    disabled
                    className="mt-8 block w-full cursor-not-allowed rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white opacity-70"
                  >
                    Coming Soon
                  </button>

                </div>

              </div>

              {/* SPOTLIGHT */}

              <div className="relative rounded-3xl border border-amber-200 bg-amber-50 p-7 shadow-sm">

                <div className="absolute left-0 right-0 top-0 rounded-t-3xl bg-amber-500 px-4 py-2 text-center text-xs font-bold uppercase tracking-wide text-white">
                  Maximum Exposure
                </div>

                <div className="pt-5">

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <h4 className="text-xl font-bold text-slate-900">
                        Spotlight
                      </h4>

                      <p className="mt-1 text-sm text-slate-600">
                        Fill rooms faster.
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-3xl font-bold text-slate-900">
                        $18
                      </p>

                      <p className="text-xs text-slate-500">
                        /month
                      </p>
                    </div>

                  </div>

                  <ul className="mt-7 space-y-3 text-sm text-slate-700">
                    <li>✓ Everything in Pro</li>
                    <li>✓ Homepage exposure</li>
                    <li>✓ Top search placement</li>
                    <li>✓ University-specific targeting</li>
                    <li>✓ Spotlight badge</li>
                    <li>✓ Push notifications</li>
                    <li>✓ Detailed analytics</li>
                    <li>✓ Priority support</li>
                  </ul>

                  <button
                    type="button"
                    disabled
                    className="mt-8 block w-full cursor-not-allowed rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white opacity-70"
                  >
                    Coming Soon
                  </button>

                </div>

              </div>

            </div>
          </div>

          {/* ==================================================
              FIRST 50 LANDLORDS PROMO
          ================================================== */}

          <div className="mt-14 overflow-hidden rounded-3xl border border-amber-200 bg-amber-50">

            <div className="px-7 py-8 md:px-10 md:py-10">

              <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

                <div className="max-w-2xl">

                  <div className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
                    📣 Limited-Time Promotion
                  </div>

                  <h3 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                    First 50 Landlords
                    <span className="block text-brand-blue">
                      Get Pro for FREE.
                    </span>
                  </h3>

                  <p className="mt-4 text-lg leading-8 text-slate-600">
                    Be one of the first 50 landlords to join Musha Link
                    and get the Pro plan at no cost.
                  </p>

                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    Offer valid for landlords who sign up by
                    October 31, 2026.
                  </p>

                </div>

                <div className="shrink-0 rounded-3xl bg-white p-7 text-center shadow-sm">

                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Pro Plan
                  </p>

                  <div className="mt-2 flex items-center justify-center gap-3">

                    <span className="text-xl font-semibold text-slate-400 line-through">
                      $10
                    </span>

                    <span className="text-5xl font-bold text-brand-blue">
                      $0
                    </span>

                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    /month
                  </p>

                  <Link
                    href="/auth/signup"
                    className="mt-6 inline-flex rounded-xl bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark"
                  >
                    Claim Your Free Pro
                  </Link>

                </div>

              </div>

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