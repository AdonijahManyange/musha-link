import ListingCard from "@/components/listing/ListingCard";
import { prisma } from "@/lib/prisma";

export default async function FeaturedListings() {
  const listings = await prisma.listing.findMany({
    where: {
      status: "PUBLISHED",
      isActive: true,
    },
    include: {
      university: true,
      photos: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 9,
  });

  const spotlightListings = listings.map((listing) => {
    const coverPhoto =
      listing.photos.find((photo) => photo.isCover) ||
      listing.photos[0];

    return {
      id: listing.id,
      slug: listing.id,
      title: listing.title,
      university: listing.university.name,
      suburb: listing.suburb ?? "",
      city: listing.city,
      roomType: listing.roomType,
      price: listing.monthlyRent,
      images: coverPhoto
        ? [coverPhoto.url]
        : ["/images/listings/room2.png"],
      description: listing.description,
      amenities: listing.amenities,
      featured: true,
      verified: true,
      landlord: {
        name: "",
        phone: "",
        email: "",
      },
    };
  });

  if (spotlightListings.length === 0) {
    return null;
  }

  // ... existing JSX stays the same


  return (
    <section
      id="spotlight"
      className="bg-slate-50 py-24 transition-colors duration-200 dark:bg-slate-950"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* =====================================================
            SECTION HEADER
        ===================================================== */}

        <div className="mb-8 text-center md:mb-14">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-blue/10 bg-white px-3 py-1.5 text-xs font-semibold text-brand-blue shadow-sm transition-colors duration-200 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-300 md:mb-4 md:px-4 md:py-2 md:text-sm">
            <span className="text-base">✦</span>
            Spotlight
          </div>

         <h2 className="text-3xl font-bold tracking-tight text-slate-900 transition-colors duration-200 dark:text-white md:text-4xl">
            Spotlight Listings
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 transition-colors duration-200 dark:text-slate-300 md:mt-4 md:text-lg">
            Premium student accommodation, hand-picked
            for your next home.
          </p>
        </div>

                {/* =====================================================
                    CINEMATIC SPOTLIGHT MARQUEE
                    Automatic movement on desktop and mobile
                ===================================================== */}

                <div
                  className="
                    group/marquee
                    relative
                    -mx-6
                    overflow-hidden
                    px-6
                    pb-4
                  "
                >
                  <div className="spotlight-track">
                    {/* First set of listings */}
                    {spotlightListings.map((listing) => (
                      <div
                        key={listing.id}
                        className="
                          w-[72vw]
                          max-w-[300px]
                          shrink-0
                          sm:w-[300px]
                          md:w-[340px]
                          lg:w-[360px]
                        "
                      >
                        <ListingCard
                          listing={listing}
                          variant="spotlight"
                          source="browse"
                        />
                      </div>
                    ))}

                    {/* Duplicate set for a continuous loop */}
                    {spotlightListings.map((listing) => (
                      <div
                        key={listing.id}
                        className="
                          w-[72vw]
                          max-w-[300px]
                          shrink-0
                          sm:w-[300px]
                          md:w-[340px]
                          lg:w-[360px]
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
                </div>

                {/* Swipe hint for mobile */}
                {spotlightListings.length > 1 && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500 md:hidden">
                    <span>Swipe to explore</span>
                    <span aria-hidden="true">→</span>
                  </div>
                )}

      </div>
    </section>
  );
}