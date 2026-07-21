import ListingCard from "@/components/listing/ListingCard";
import { listings } from "@/lib/listings";

export default function FeaturedListings() {
  const featuredListings = listings.filter(
    (listing) => listing.featured
  );
  return (
    <section 
      id="browse"
      className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-14 text-center">

          <h2 className="text-4xl font-bold text-slate-900">
            Featured Listings
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Hand-picked student accommodation across Zimbabwe.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
            />
          ))}
        </div>

      </div>
    </section>
  );
}