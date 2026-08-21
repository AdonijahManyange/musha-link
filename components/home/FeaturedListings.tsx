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
            SPOTLIGHT LISTINGS
        ===================================================== */}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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