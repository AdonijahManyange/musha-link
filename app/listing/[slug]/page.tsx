import { notFound } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { getAmenityIcon } from "@/lib/amenityIcons";

import Navbar from "@/components/layout/Navbar";
import ImageGallery from "@/components/listing/ImageGallery";
import { listings } from "@/lib/listings";
import ListingActions from "@/components/listing/ListingActions";


export default async function ListingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const listing = listings.find(
    (listing) => listing.slug === slug
  );

  if (!listing) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 py-12">

        {/* Image Gallery */}
        <ImageGallery
          images={listing.images}
          title={listing.title}
        />

        {/* Main Content */}
        <div className="mt-12 grid gap-12 lg:grid-cols-[2fr_1fr]">

          {/* Left Column */}
          <div>

            {listing.verified && (
              <div className="mb-4 flex items-center gap-2 text-green-600">
                <ShieldCheck size={20} />
                <span className="font-medium">
                  Verified Listing
                </span>
              </div>
            )}

            <h1 className="text-4xl font-bold text-slate-900">
              {listing.title}
            </h1>

            <p className="mt-3 text-2xl font-medium text-brand-blue">
              {listing.university}
            </p>

            <p className="text-lg text-slate-600">
              {listing.suburb}, {listing.city}
            </p>

            <section className="mt-12">
              <h2 className="text-3xl font-bold text-slate-900">
                About this Property
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                {listing.description}
              </p>
            </section>

            <section className="mt-12">
              <h2 className="text-3xl font-bold text-slate-900">
                Amenities
              </h2>

              <div className="mt-6 flex flex-wrap gap-3">

                {listing.amenities.map((amenity) => (
                    <span
                    key={amenity}
                    className="flex items-center gap-2 rounded-full bg-green-100 px-5 py-2 font-medium text-green-700"
                    >
                    {getAmenityIcon(amenity)}
                    {amenity}
                    </span>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column */}
          <div>

            <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">

              <h2 className="text-5xl font-bold text-brand-blue">
                US${listing.price}
              </h2>

              <p className="mt-1 text-slate-500">
                per month
              </p>

              <ListingActions
                landlord={listing.landlord}
                listingTitle={listing.title}
              />

              <div className="mt-8 space-y-5 border-t border-slate-200 pt-6">

                <div>
                  <p className="text-sm text-slate-500">
                    University
                  </p>

                  <p className="font-semibold text-slate-900">
                    {listing.university}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Location
                  </p>

                  <p className="font-semibold text-slate-900">
                    {listing.suburb}, {listing.city}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Room Type
                  </p>

                  <p className="font-semibold text-slate-900">
                    {listing.roomType}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Status
                  </p>

                  <p className="font-semibold text-green-600">
                    Verified Listing
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}