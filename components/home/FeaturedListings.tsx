import ListingCard from "@/components/listing/ListingCard";
import { listings } from "@/lib/listings";

export default function FeaturedListings() {
  const spotlightListings = listings
    .filter((listing) => listing.featured)
    .slice(0, 3);

  // Don't render the section if there are no paid Spotlight listings.
  if (spotlightListings.length === 0) {
    return null;
  }

  return (
    <section
      id="spotlight"
      className="bg-slate-50 py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* =====================================================
            SECTION HEADER
        ===================================================== */}

        <div className="mb-14 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-blue/10 bg-white px-4 py-2 text-sm font-semibold text-brand-blue shadow-sm">
            <span className="text-base">✦</span>
            Spotlight
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-slate-900">
            Spotlight Listings
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Premium student accommodation, hand-picked
            for your next home.
          </p>
        </div>

        {/* =====================================================
            MOBILE SPOTLIGHT CAROUSEL
            Desktop remains unchanged.
        ===================================================== */}

        <div className="md:hidden">
          <div
            className="
              -mx-6
              flex
              gap-5
              overflow-x-auto
              px-6
              pb-4
              snap-x
              snap-mandatory
              overscroll-x-contain
              scrollbar-hide
            "
          >
            {spotlightListings.map((listing) => (
              <div
                key={listing.id}
                className="
                  w-[88%]
                  min-w-[88%]
                  shrink-0
                  snap-start
                "
              >
                <ListingCard
                  listing={listing}
                  variant="spotlight"
                  source="browse"
                />
              </div>
            ))}
          </div>

          {/* Swipe hint */}
          {spotlightListings.length > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
              <span>Swipe to explore</span>
              <span aria-hidden="true">→</span>
            </div>
          )}
        </div>

        {/* =====================================================
            DESKTOP SPOTLIGHT LISTINGS
            DO NOT CHANGE DESKTOP UI
        ===================================================== */}

        <div className="hidden gap-8 md:grid md:grid-cols-2 lg:grid-cols-3">
          {spotlightListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              variant="spotlight"
              source="browse"
            />
          ))}
        </div>

      </div>
    </section>
  );
}