import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ShieldCheck,
  MapPin,
  Home,
  Users,
  GraduationCap,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import ListingGallery from "@/components/ListingGallery";
import ContactLandlordButton from "@/components/ContactLandlordButton";
import DatabaseListingActions from "@/components/listing/DatabaseListingActions";

type ListingPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    from?: string;
  }>;
};

// ============================================================
// SHARED STYLES
// ============================================================

const cardClass =
  "rounded-xl border border-slate-200 bg-white transition-colors dark:border-slate-700 dark:bg-slate-900";

const headingClass =
  "text-xl font-bold text-slate-900 dark:text-white";

const labelClass =
  "text-xs text-slate-500 dark:text-slate-400";

const valueClass =
  "mt-1 font-semibold text-slate-900 dark:text-slate-100";

const mutedTextClass =
  "text-sm text-slate-600 dark:text-slate-300";

const iconContainerClass =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800";

const iconClass =
  "text-blue-600 dark:text-blue-400";

// ============================================================
// PAGE
// ============================================================

export default async function PublicListingPage({
  params,
  searchParams,
}: ListingPageProps) {
  const { id } = await params;
  const { from } = await searchParams;

  const backHref =
    from === "dashboard"
      ? "/dashboard/landlord/listings"
      : from === "saved"
        ? "/saved"
        : "/browse";

  const backLabel =
    from === "dashboard"
      ? "Back to My Listings"
      : from === "saved"
        ? "Back to Saved"
        : "Back to Listings";

  // ============================================================
  // LOAD LISTING
  // ============================================================

  const listing = await prisma.listing.findUnique({
    where: { id },

    include: {
      university: true,

      landlord: {
        select: {
          id: true,
          name: true,
          verified: true,

          landlordProfile: {
            select: {
              profilePhotoUrl: true,
              city: true,
              province: true,
              country: true,
            },
          },

          _count: {
            select: {
              listings: {
                where: {
                  status: "PUBLISHED",
                  isActive: true,
                },
              },
            },
          },
        },
      },

      photos: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  // ============================================================
  // VALIDATE LISTING
  // ============================================================

  if (!listing) {
    notFound();
  }

  if (
    listing.status !== "PUBLISHED" ||
    !listing.isActive
  ) {
    notFound();
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">

        {/* BACK LINK */}

        <div className="mb-6">
          <Link
            href={backHref}
            className="text-sm font-medium text-slate-600 transition hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-400"
          >
            ← {backLabel}
          </Link>
        </div>

        {/* PHOTO GALLERY */}

        <ListingGallery
          photos={listing.photos}
          title={listing.title}
        />

        {/* MAIN LISTING AREA */}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">

          {/* LEFT CONTENT */}

          <div className="min-w-0">

            {/* VERIFIED LISTING */}

            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
              <ShieldCheck size={16} strokeWidth={2.5} />
              <span>Verified Listing</span>
            </div>

            {/* TITLE */}

            <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              {listing.title}
            </h1>

            {/* UNIVERSITY */}

            <div className="mt-2 flex items-center gap-2 text-slate-700 dark:text-slate-200">
              <GraduationCap
                size={18}
                className={iconClass}
              />

              <span className="font-medium">
                {listing.university.name}
              </span>
            </div>

            {/* UTILITIES & SERVICES */}

            {(
              listing.internetProvider ||
              listing.waterSource ||
              listing.waterDrinkable !== null ||
              listing.solarBackupCapacity
            ) && (
              <section className="mt-8">
                <h2 className={headingClass}>
                  Utilities & Services
                </h2>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Utilities, internet, and backup power available at this
                  property.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">

                  {listing.internetProvider && (
                    <div className={`${cardClass} p-4`}>
                      <p className={labelClass}>
                        Internet Provider
                      </p>

                      <p className={valueClass}>
                        {getInternetProviderLabel(
                          listing.internetProvider
                        )}
                      </p>
                    </div>
                  )}

                  {listing.waterSource && (
                    <div className={`${cardClass} p-4`}>
                      <p className={labelClass}>
                        Water Source
                      </p>

                      <p className={valueClass}>
                        {getWaterSourceLabel(
                          listing.waterSource
                        )}
                      </p>
                    </div>
                  )}

                  {listing.waterDrinkable !== null && (
                    <div className={`${cardClass} p-4`}>
                      <p className={labelClass}>
                        Drinkable Water
                      </p>

                      <p className={valueClass}>
                        {listing.waterDrinkable
                          ? "Yes"
                          : "No"}
                      </p>
                    </div>
                  )}

                  {listing.solarBackupCapacity && (
                    <div className={`${cardClass} p-4`}>
                      <p className="text-xs text-amber-700 dark:text-amber-400">
                        ☀️ Solar Backup
                      </p>

                      <p className={valueClass}>
                        {getSolarBackupLabel(
                          listing.solarBackupCapacity
                        )}
                      </p>

                      {listing.solarBackupCapacity !== "NONE" && (
                        <p className="mt-2 text-sm leading-5 text-slate-600 dark:text-slate-300">
                          {getSolarBackupDescription(
                            listing.solarBackupCapacity
                          )}
                        </p>
                      )}
                    </div>
                  )}

                </div>
              </section>
            )}

            {/* SHORT LOCATION */}

            <div className="mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <MapPin
                size={16}
                className="shrink-0 text-blue-600 dark:text-blue-400"
              />

              <span>
                {listing.suburb
                  ? `${listing.suburb}, ${listing.city}, ${listing.province}`
                  : `${listing.city}, ${listing.province}`}
              </span>
            </div>

            {/* ABOUT */}

            <section className="mt-8">
              <h2 className={headingClass}>
                About this Property
              </h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                {listing.description}
              </p>
            </section>

            {/* PROPERTY DETAILS */}

            <section className="mt-8">
              <h2 className={headingClass}>
                Property Details
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                {/* PROPERTY TYPE */}

                <div className={`${cardClass} flex items-center gap-3 p-4`}>
                  <div className={iconContainerClass}>
                    <Home size={19} className={iconClass} />
                  </div>

                  <div className="min-w-0">
                    <p className={labelClass}>
                      Property Type
                    </p>

                    <p className={valueClass}>
                      {formatPropertyType(
                        listing.propertyType
                      )}
                    </p>
                  </div>
                </div>

                {/* ROOM TYPE */}

                <div className={`${cardClass} flex items-center gap-3 p-4`}>
                  <div className={iconContainerClass}>
                    <Home size={19} className={iconClass} />
                  </div>

                  <div className="min-w-0">
                    <p className={labelClass}>
                      Room Type
                    </p>

                    <p className={valueClass}>
                      {formatRoomType(
                        listing.roomType
                      )}
                    </p>
                  </div>
                </div>

                {/* GENDER PREFERENCE */}

                <div className={`${cardClass} flex items-center gap-3 p-4`}>
                  <div className={iconContainerClass}>
                    <Users size={19} className={iconClass} />
                  </div>

                  <div className="min-w-0">
                    <p className={labelClass}>
                      Gender Preference
                    </p>

                    <p className={valueClass}>
                      {formatGenderPreference(
                        listing.genderPreference
                      )}
                    </p>
                  </div>
                </div>

                {/* UNIVERSITY */}

                <div className={`${cardClass} flex items-center gap-3 p-4`}>
                  <div className={iconContainerClass}>
                    <GraduationCap size={19} className={iconClass} />
                  </div>

                  <div className="min-w-0">
                    <p className={labelClass}>
                      University
                    </p>

                    <p className={valueClass}>
                      {listing.university.name}
                    </p>
                  </div>
                </div>

              </div>
            </section>

            {/* AMENITIES */}

            {listing.amenities.length > 0 && (
              <section className="mt-8">
                <h2 className={headingClass}>
                  Amenities & Facilities
                </h2>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Everything available at this property.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {listing.amenities.map((amenity) => {
                    const details = getAmenityDetails(amenity);

                    return (
                      <div
                        key={amenity}
                        className={`${cardClass} flex items-center gap-3 p-4`}
                      >
                        <span className="text-xl leading-none">
                          {details.emoji}
                        </span>

                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          {details.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* LOCATION */}

            <section className="mt-8">
              <h2 className={headingClass}>
                Location
              </h2>

              <div className={`${cardClass} mt-4 rounded-2xl p-5`}>
                <div className="flex gap-3">
                  <MapPin
                    size={20}
                    className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                  />

                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {listing.suburb
                        ? `${listing.suburb}, ${listing.city}, ${listing.province}`
                        : `${listing.city}, ${listing.province}`}
                    </p>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {listing.country}
                    </p>

                    {listing.distanceToUniversityKm !== null && (
                      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                        {listing.distanceToUniversityKm.toFixed(1)} km from{" "}
                        {listing.university.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* RIGHT SIDEBAR */}

          <aside>
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900">

              {/* PRICE */}

              <div>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-400 sm:text-4xl">
                  US${listing.monthlyRent}
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  per month
                </p>

                {/* COST BREAKDOWN */}

                <div className="mt-5 space-y-3 border-t border-slate-200 pt-5 dark:border-slate-700">

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Security Deposit
                    </span>

                    <span className="text-right text-sm font-medium text-slate-900 dark:text-slate-100">
                      {listing.depositRequired
                        ? listing.depositAmount
                          ? `US$${listing.depositAmount}`
                          : "Required"
                        : "None"}
                    </span>
                  </div>

                  {listing.additionalFees && (
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Additional Fees
                      </p>

                      <p className="mt-1 text-sm leading-5 text-slate-900 dark:text-slate-100">
                        {listing.additionalFees}
                      </p>
                    </div>
                  )}

                  {listing.utilitiesIncluded && (
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Utilities
                      </p>

                      <p className="mt-1 text-sm leading-5 text-slate-900 dark:text-slate-100">
                        {listing.utilitiesIncluded}
                      </p>
                    </div>
                  )}

                  {listing.internetCharges && (
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Internet
                      </p>

                      <p className="mt-1 text-sm leading-5 text-slate-900 dark:text-slate-100">
                        {listing.internetCharges}
                      </p>
                    </div>
                  )}

                </div>
              </div>

              {/* ACTION BUTTONS */}

              <div className="mt-6 space-y-3">
                <ContactLandlordButton listingId={listing.id} />

                <DatabaseListingActions
                  listingId={listing.id}
                  listingTitle={listing.title}
                  landlord={{
                    name: listing.landlord.name || "Landlord",
                    phone: "",
                    email: "",
                  }}
                />
              </div>

              {/* STATUS */}

              <div className="my-5 border-t border-slate-200 dark:border-slate-700" />

              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Status
                </p>

                <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  <ShieldCheck size={15} />
                  <span>Verified Listing</span>
                </div>
              </div>

              {/* LANDLORD */}

              <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-700">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Listed by
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-slate-100 shadow-sm ring-2 ring-white dark:bg-slate-800 dark:ring-slate-700">
                    {listing.landlord.landlordProfile?.profilePhotoUrl ? (
                      <img
                        src={
                          listing.landlord.landlordProfile.profilePhotoUrl
                        }
                        alt={listing.landlord.name || "Landlord"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lg font-bold text-blue-700 dark:text-blue-400">
                        {(listing.landlord.name || "L")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate font-semibold text-slate-900 dark:text-white">
                        {listing.landlord.name || "Landlord"}
                      </p>

                      {listing.landlord.verified && (
                        <span
                          title="Verified landlord"
                          className="shrink-0 text-emerald-600 dark:text-emerald-400"
                        >
                          ✓
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {listing.landlord._count.listings}{" "}
                      {listing.landlord._count.listings === 1
                        ? "active listing"
                        : "active listings"}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/landlords/${listing.landlord.id}`}
                  className="mt-4 flex w-full items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:bg-slate-50 hover:text-blue-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                >
                  View Landlord Profile
                </Link>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}

// ============================================================
// HELPERS
// ============================================================

function formatPropertyType(propertyType: string) {
  const labels: Record<string, string> = {
    HOUSE: "House",
    FLAT: "Flat",
    APARTMENT: "Apartment",
    TOWNHOUSE: "Townhouse",
    COTTAGE: "Cottage",
    ROOMING_HOUSE: "Rooming House",
    OTHER: "Other",
  };

  return labels[propertyType] || propertyType;
}

function formatRoomType(roomType: string) {
  const labels: Record<string, string> = {
    PRIVATE: "Private Room",
    SHARED: "Shared Room",
    ENTIRE_PROPERTY: "Entire Property",
  };

  return labels[roomType] || roomType;
}

function formatGenderPreference(preference: string) {
  const labels: Record<string, string> = {
    ANY: "Any Gender",
    MALE: "Male",
    FEMALE: "Female",
  };

  return labels[preference] || preference;
}

function getInternetProviderLabel(provider: string) {
  const providers: Record<string, string> = {
    LIQUID_HOME: "Liquid Home",
    TELONE: "TelOne",
    STARLINK: "Starlink",
    UTANDE: "Utande",
    AFRICOM: "Africom",
    POWERTEL: "Powertel",
    DANDEMUTANDE: "Dandemutande",
    ZARNET: "Zarnet",
    ECONET: "Econet",
    NETONE: "NetOne",
    TELECEL: "Telecel",
    OTHER: "Other",
    NONE: "No Internet",
  };

  return providers[provider] || provider;
}

function getWaterSourceLabel(source: string) {
  const sources: Record<string, string> = {
    BOREHOLE_FRESH_WATER: "Borehole Fresh Water",
    TAP_FRESH_WATER: "Tap Fresh Water",
    BOREHOLE_AND_TAP: "Borehole + Tap",
    NO_RELIABLE_SUPPLY: "No Reliable Water Supply",
    OTHER: "Other",
  };

  return sources[source] || source;
}

function getSolarBackupLabel(capacity: string) {
  const capacities: Record<string, string> = {
    NONE: "No Solar Backup",
    BASIC_500VA_2KVA: "Basic Backup — 500VA–2kVA",
    STANDARD_3_4KVA: "Standard Backup — 3–4kVA",
    HIGH_CAPACITY_5_6KVA: "High-Capacity Backup — 5–6kVA",
    PREMIUM_7KVA_PLUS: "Premium Backup — 7+ kVA",
  };

  return capacities[capacity] || capacity;
}

function getSolarBackupDescription(capacity: string) {
  const descriptions: Record<string, string> = {
    BASIC_500VA_2KVA:
      "Typically supports lights, Wi-Fi / router, laptops, phones & chargers, and TV.",

    STANDARD_3_4KVA:
      "Includes Basic Backup, plus fridge / freezer, multiple devices, multiple laptops, and small household appliances.",

    HIGH_CAPACITY_5_6KVA:
      "Includes Standard Backup, plus electric jugs / kettles, irons, washing machines, and multiple household appliances.",

    PREMIUM_7KVA_PLUS:
      "Includes High-Capacity Backup, plus higher-power appliances and multiple appliances running together.",
  };

  return descriptions[capacity] || "";
}

function getAmenityDetails(amenity: string) {
  const amenities: Record<string, { label: string; emoji: string }> = {
    WIFI: { label: "Wi-Fi", emoji: "📶" },
    SOLAR_POWER: { label: "Solar Power", emoji: "☀️" },
    BOREHOLE: { label: "Borehole", emoji: "🚰" },
    ELECTRICITY: { label: "Electricity", emoji: "⚡" },
    BACKUP_GENERATOR: { label: "Backup Generator", emoji: "🔋" },
    WATER: { label: "Water", emoji: "💧" },
    SECURITY: { label: "Security", emoji: "🛡️" },
    PARKING: { label: "Parking", emoji: "🚗" },
    FURNISHED: { label: "Furnished", emoji: "🛏️" },
    LAUNDRY: { label: "Laundry", emoji: "🧺" },
    KITCHEN: { label: "Kitchen", emoji: "🍳" },
    STUDY_AREA: { label: "Study Area", emoji: "📚" },
    GARDEN: { label: "Garden", emoji: "🌳" },
    SWIMMING_POOL: { label: "Swimming Pool", emoji: "🏊" },
    SMART_TV: { label: "Smart TV", emoji: "📺" },
    NETFLIX: { label: "Netflix", emoji: "🎬" },
    PRIME_VIDEO: { label: "Prime Video", emoji: "▶️" },
    DSTV: { label: "DSTV", emoji: "📺" },
  };

  return (
    amenities[amenity] || {
      label: amenity,
      emoji: "✓",
    }
  );
}