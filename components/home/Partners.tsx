import Image from "next/image";
import Link from "next/link";

export default function Partners() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-blue">
            Our Partners
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Better opportunities, built together.
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600">
            We believe in working with businesses that share our vision
            of creating better experiences and opportunities across
            Zimbabwe.
          </p>
        </div>

        {/* Partner card */}
        <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:shadow-lg">
          <div className="grid items-center gap-8 p-6 sm:p-10 md:grid-cols-[220px_1fr]">
            {/* Partner logo */}
            <div className="flex items-center justify-center">
              <div className="relative flex h-48 w-48 items-center justify-center overflow-hidden rounded-2xl bg-white p-2">
                <Image
                  src="/partners/ad-media-international.png"
                  alt="AD Media International logo"
                  width={220}
                  height={220}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>

            {/* Partner information */}
            <div>
              <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-brand-blue">
                Creative & Marketing Partner
              </div>

              <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
                AD Media International
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                A digital marketing and event production company helping
                businesses strengthen their brands, reach their audiences,
                and bring their ideas to life.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                    href="https://www.facebook.com/admediainternational"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark"
                    >
                    Visit Facebook Page
                    <span className="ml-2" aria-hidden="true">
                        ↗
                    </span>
                </a>

                <span className="text-xs text-slate-500">
                  Digital Marketing · Event Production
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Closing statement */}
        <p className="mt-8 text-center text-sm text-slate-500">
          Proud to build connections that create opportunities.
        </p>
      </div>
    </section>
  );
}