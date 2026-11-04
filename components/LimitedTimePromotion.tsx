import Link from "next/link";

export default function LimitedTimePromotion() {
  return (
    <section className="bg-surface px-6 py-10 md:py-12">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-amber-400/50 bg-amber-50 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/10 dark:bg-slate-900">
        <div className="px-7 py-8 md:px-10 md:py-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
                📣 Limited-Time Promotion
              </div>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">
                First 25 Landlords
                <span className="block text-blue-400">
                  Get one year of free listings.
                </span>
              </h2>

              <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
                Complete your signup, landlord verification, and listing upload
                by November 30, 2026 to qualify. The offer is available to the
                first 25 landlords who complete all three steps. Incomplete or
                pending applications do not count.
              </p>

              <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                After the free year, standard rates apply. If you don’t continue
                with a paid plan, your account moves to Free mode. Your listing
                remains on the site, with reduced visibility.
              </p>
            </div>

            <div className="shrink-0 rounded-3xl border border-border bg-surface-elevated p-7 text-center shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
                Eligible landlords
              </p>

              <p className="mt-2 text-5xl font-bold text-blue-400">First 25</p>

              <p className="mt-2 max-w-[12rem] text-sm text-text-muted">
                One year of free listings for qualifying signups
              </p>

              <Link
                href="/auth/signup"
                className="mt-6 inline-flex rounded-xl bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark"
              >
                Start Landlord Signup
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
