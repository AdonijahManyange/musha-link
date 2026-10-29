"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  CircleAlert,
  ClipboardCheck,
  MapPin,
  Megaphone,
  MessageSquareText,
  PencilLine,
  Sparkles,
  Star,
  Tags,
} from "lucide-react";

type ListingPhoto = {
  id: string;
  url: string;
  fileName: string;
  sortOrder: number;
  isCover: boolean;
};

type Listing = {
  id: string;
  title: string;
  city: string;
  province: string;
  monthlyRent: number;
  propertyType: string;
  roomType: string;
  genderPreference: string;
  description: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isActive: boolean;
  distanceToUniversityKm: number | null;
  university: {
    name: string;
    city: string;
  };
  photos: ListingPhoto[];
  canPublish: boolean;
  missingPhotoCategories: {
    category: string;
    required: number;
    uploaded: number;
  }[];
};

type Recommendation = {
  title: string;
  detail: string;
  href: string;
  icon: typeof Camera;
  complete: boolean;
};

type Guide = {
  title: string;
  description: string;
  icon: typeof Camera;
};

const guides: Guide[] = [
  {
    title: "Spotlight Your Property",
    description:
      "Learn how additional promotional placement can help students discover your accommodation.",
    icon: Megaphone,
  },
  {
    title: "Picture Perfect",
    description:
      "Use clear, accurate photos that help students understand the property before arranging a viewing.",
    icon: Camera,
  },
  {
    title: "Titles That Get Clicks",
    description:
      "Write a specific, informative title that describes the accommodation accurately.",
    icon: Tags,
  },
  {
    title: "Descriptions That Sell",
    description:
      "Explain the room, facilities, included utilities, and important rental conditions.",
    icon: PencilLine,
  },
  {
    title: "Location Is Your Advantage",
    description:
      "Help students understand the property's city, area, and distance to their university.",
    icon: MapPin,
  },
  {
    title: "Reviews That Build Trust",
    description:
      "Build trust through accurate information and professional communication with students.",
    icon: Star,
  },
  {
    title: "Price It Right",
    description:
      "Present rent, deposits, utilities, and additional fees clearly.",
    icon: ClipboardCheck,
  },
  {
    title: "Enquiries Into Tenants",
    description:
      "Respond promptly to enquiries and keep viewing arrangements organized.",
    icon: MessageSquareText,
  },
];

function getRecommendations(listing: Listing): Recommendation[] {
  const hasUsefulTitle =
    listing.title.trim().length >= 8;

  const hasUsefulDescription =
    listing.description.trim().length >= 100;

  const missingCategories = listing.missingPhotoCategories ?? [];

  const hasCompletePhotoCoverage =
    missingCategories.length === 0;

  const hasCoverPhoto =
    listing.photos.some((photo) => photo.isCover);

  const hasLocation =
    Boolean(listing.city?.trim()) &&
    Boolean(listing.province?.trim());

  const hasUniversity =
    Boolean(listing.university?.name?.trim());

  const hasValidRent =
    Number.isFinite(listing.monthlyRent) &&
    listing.monthlyRent > 0;

  const photoDetail = hasCompletePhotoCoverage
    ? hasCoverPhoto
      ? "All required photo categories are complete, and a cover photo is selected. Review your images for clarity and accuracy."
      : "All required photo categories are complete, but you still need to select a cover photo."
    : `Complete the missing photo categories: ${missingCategories
        .map(
          (item) =>
            `${item.category.replaceAll("_", " ").toLowerCase()} (${item.uploaded}/${item.required})`
        )
        .join(", ")}.`;

  return [
    {
      title: "Complete your property photos",
      detail: photoDetail,
      href: `/dashboard/landlord/listings/${listing.id}/photos`,
      icon: Camera,
      complete:
        hasCompletePhotoCoverage && hasCoverPhoto,
    },
    {
      title: "Strengthen your listing title",
      detail: hasUsefulTitle
        ? "Your title has a useful length. Make sure it accurately identifies the accommodation and highlights a meaningful feature."
        : "Use a descriptive title that helps students understand the accommodation at a glance.",
      href: `/dashboard/landlord/listings/${listing.id}/edit#title`,
      icon: Tags,
      complete: hasUsefulTitle,
    },
    {
        title: "Complete your description",
        detail: hasUsefulDescription
            ? "Your description has useful detail. Confirm that the facilities, utilities, and rental conditions are clearly explained."
            : "Explain the room, facilities, utilities, shared spaces, and important rental conditions in more detail.",
        href: `/dashboard/landlord/listings/${listing.id}/edit#description`,
        icon: PencilLine,
        complete: hasUsefulDescription,
    },
    {
      title: "Review your rental price",
      detail: hasValidRent
        ? "Monthly rent is provided. Make sure deposit requirements, utilities, and additional fees are explained clearly."
        : "Enter a valid monthly rent so students can evaluate whether the property fits their budget.",
      href: `/dashboard/landlord/listings/${listing.id}/edit`,
      icon: ClipboardCheck,
      complete: hasValidRent,
    },
    {
      title: "Check your location information",
      detail: hasLocation
        ? `Your listing identifies ${listing.city}, ${listing.province}. Make sure your property address is complete and accurate so MushaLink can calculate location details correctly.`
        : "Complete your property address, suburb, city, and province so MushaLink can identify the property's location accurately.",
      href: `/dashboard/landlord/listings/${listing.id}/edit#property-information`,
      icon: MapPin,
      complete: hasLocation,
    },
    {
      title: "Confirm your university information",
      detail: hasUniversity
        ? `Your listing is associated with ${listing.university.name}. Check that this is the appropriate university for students considering your property.`
        : "Associate your property with the correct university to help students assess its suitability.",
      href: `/dashboard/landlord/listings/${listing.id}/edit#university`,
      icon: Star,
      complete: hasUniversity,
    },
  ];
}

function calculateQualityScore(listing: Listing) {
  const missingCategories =
    listing.missingPhotoCategories ?? [];

  const hasCompletePhotoCoverage =
    missingCategories.length === 0;

  const checks = [
    {
      weight: 15,
      complete: listing.title.trim().length >= 8,
    },
    {
      weight: 20,
      complete: listing.description.trim().length >= 100,
    },
    {
      // Photo quality depends on required category coverage
      // and a selected cover photo, not just total count.
      weight: 25,
      complete:
        hasCompletePhotoCoverage &&
        listing.photos.some((photo) => photo.isCover),
    },
    {
      weight: 15,
      complete:
        Number.isFinite(listing.monthlyRent) &&
        listing.monthlyRent > 0,
    },
    {
      weight: 15,
      complete:
        Boolean(listing.propertyType) &&
        Boolean(listing.roomType) &&
        Boolean(listing.genderPreference),
    },
    {
      weight: 10,
      complete:
        Boolean(listing.city.trim()) &&
        Boolean(listing.province.trim()) &&
        Boolean(listing.university?.name?.trim()),
    },
  ];

  return checks.reduce(
    (score, check) =>
      score + (check.complete ? check.weight : 0),
    0
  );
}

function getScoreLabel(score: number) {
  if (score >= 85) return "Strong completeness";
  if (score >= 60) return "Room to improve";
  return "Needs attention";
}

export default function ListingBoostPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListingId, setSelectedListingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadListings() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/listings", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load your listings."
          );
        }

        if (!Array.isArray(data)) {
          throw new Error("The listings response was invalid.");
        }

        if (cancelled) return;

        const activeListings = data.filter(
          (listing: Listing) => listing.status !== "ARCHIVED"
        );

        setListings(activeListings);

        setSelectedListingId(
          activeListings[0]?.id ?? ""
        );
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your listings."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadListings();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedListing = listings.find(
    (listing) => listing.id === selectedListingId
  );

  const score = selectedListing
    ? calculateQualityScore(selectedListing)
    : 0;

  const recommendations = useMemo(
    () =>
      selectedListing
        ? getRecommendations(selectedListing)
        : [],
    [selectedListing]
  );

  const incompleteRecommendations =
    recommendations.filter(
      (recommendation) => !recommendation.complete
    );

  const publishedCount = listings.filter(
    (listing) =>
      listing.status === "PUBLISHED" && listing.isActive
  ).length;

  const averageScore =
    listings.length > 0
      ? Math.round(
          listings.reduce(
            (total, listing) =>
              total + calculateQualityScore(listing),
            0
          ) / listings.length
        )
      : 0;

  const panelClass =
    "rounded-2xl border border-border bg-surface shadow-sm";

  const mutedTextClass =
    "text-sm leading-6 text-text-secondary";

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-text-primary transition-colors duration-200 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/dashboard/landlord"
          className="text-sm font-medium text-brand-blue transition hover:underline dark:text-blue-400"
        >
          ← Back to Dashboard
        </Link>

        <header className="mt-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
            <Sparkles size={16} />
            Landlord tools
          </div>

          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
            Listing Boost
          </h1>

          <p className={`mt-3 max-w-2xl ${mutedTextClass}`}>
            Improve the completeness of your property listings, build
            student confidence, and learn how MushaLink promotion can
            help your accommodation stand out.
          </p>
        </header>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            {error}
          </div>
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className={`${panelClass} p-5`}>
            <p className={mutedTextClass}>Your listings</p>
            <p className="mt-2 text-3xl font-bold">
              {loading ? "—" : listings.length}
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              Active drafts and published listings
            </p>
          </div>

          <div className={`${panelClass} p-5`}>
            <p className={mutedTextClass}>Published listings</p>
            <p className="mt-2 text-3xl font-bold">
              {loading ? "—" : publishedCount}
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              Currently published and active
            </p>
          </div>

          <div className={`${panelClass} p-5`}>
            <p className={mutedTextClass}>Average completeness</p>
            <p className="mt-2 text-3xl font-bold">
              {loading || listings.length === 0
                ? loading
                  ? "—"
                  : "—"
                : `${averageScore}/100`}
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              Based on listing information provided
            </p>
          </div>
        </section>

        <section className={`${panelClass} mt-8 p-5 sm:p-7`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Improve a listing
              </h2>
              <p className={`mt-1 ${mutedTextClass}`}>
                Choose a property to see its completeness score and
                recommended improvements.
              </p>
            </div>

            <Link
              href="/dashboard/landlord/listings"
              className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-brand-blue hover:underline dark:text-blue-400"
            >
              Manage listings <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="mt-6 animate-pulse rounded-xl bg-surface-secondary p-8 text-sm text-text-secondary">
              Loading your listings...
            </div>
          ) : listings.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-border p-8 text-center">
              <ClipboardCheck
                size={32}
                className="mx-auto text-text-secondary"
              />
              <h3 className="mt-3 font-semibold">
                Start with your first listing
              </h3>
              <p className={`mx-auto mt-2 max-w-lg ${mutedTextClass}`}>
                Once you create a property listing, Listing Boost can
                identify opportunities to improve its completeness.
              </p>
              <Link
                href="/dashboard/landlord/listings/new"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-blue px-5 py-3 font-semibold text-white transition hover:bg-brand-blue-dark"
              >
                Add a property <ArrowRight size={17} />
              </Link>
            </div>
          ) : (
            <>
              <label
                htmlFor="boost-listing"
                className="mt-6 block text-sm font-semibold"
              >
                Select property
              </label>

              <select
                id="boost-listing"
                value={selectedListingId}
                onChange={(event) =>
                  setSelectedListingId(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-text-primary outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 sm:max-w-xl"
              >
                {listings.map((listing) => (
                  <option key={listing.id} value={listing.id}>
                    {listing.title} · {listing.city} · {listing.status}
                  </option>
                ))}
              </select>

              {selectedListing && (
                <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                  <div className="rounded-2xl bg-surface-secondary p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm text-text-secondary">
                          Listing completeness
                        </p>
                        <h3 className="mt-1 text-xl font-bold">
                          {selectedListing.title}
                        </h3>
                      </div>

                      <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold">
                        {selectedListing.status === "PUBLISHED"
                          ? "Published"
                          : "Draft"}
                      </span>
                    </div>

                    <div className="mt-7 flex items-end gap-2">
                      <span className="text-5xl font-bold tracking-tight">
                        {score}
                      </span>
                      <span className="mb-1 text-sm text-text-secondary">
                        / 100
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold text-text-secondary">
                      {getScoreLabel(score)}
                    </p>

                    <div
                      className="mt-4 h-2.5 overflow-hidden rounded-full bg-border"
                      role="progressbar"
                      aria-label="Listing completeness"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={score}
                    >
                      <div
                        className="h-full rounded-full bg-brand-blue transition-all duration-500"
                        style={{ width: `${score}%` }}
                      />
                    </div>

                    <p className={`mt-4 ${mutedTextClass}`}>
                      This score measures listing completeness using
                      available information. It does not predict views,
                      enquiries, or tenant bookings.
                    </p>

                    <Link
                      href={`/dashboard/landlord/listings/${selectedListing.id}/edit`}
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark"
                    >
                      Edit this listing <ArrowRight size={16} />
                    </Link>
                  </div>

                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold">
                          Recommended improvements
                        </h3>
                        <p className={`mt-1 ${mutedTextClass}`}>
                          Work through these suggestions to make your
                          listing more informative.
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-surface-secondary px-3 py-1 text-xs font-semibold">
                        {incompleteRecommendations.length} to review
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      {recommendations.map((recommendation) => {
                        const Icon = recommendation.icon;

                        return (
                          <div
                            key={recommendation.title}
                            className="flex gap-3 rounded-xl border border-border p-4"
                          >
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                recommendation.complete
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                                  : "bg-blue-50 text-brand-blue dark:bg-blue-950/40 dark:text-blue-300"
                              }`}
                            >
                              {recommendation.complete ? (
                                <CheckCircle2 size={20} />
                              ) : (
                                <Icon size={20} />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold">
                                {recommendation.title}
                              </h4>
                              <p className={`mt-1 ${mutedTextClass}`}>
                                {recommendation.detail}
                              </p>

                              <Link
                                href={recommendation.href}
                                className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand-blue hover:underline dark:text-blue-400"
                              >
                                {recommendation.complete
                                  ? "Review"
                                  : "Improve listing"}
                                <ArrowRight size={14} />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-blue-900/20 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-semibold">
                <Megaphone size={16} />
                Spotlight promotion
              </div>

              <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
                Help more students discover your property.
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Spotlight is intended to give eligible properties
                additional promotional visibility in designated MushaLink
                sections. Promotion does not guarantee enquiries or tenants.
              </p>
            </div>

            <div className="shrink-0 rounded-xl border border-white/15 bg-white/5 p-4 md:max-w-xs">
              <p className="font-semibold">
                Interested in Spotlight?
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Promotion pricing, eligibility, and purchase options will
                be available here once the Spotlight purchase flow is
                implemented.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-slate-200">
                <CircleAlert size={16} />
                Coming soon
              </span>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-blue dark:text-blue-400">
              Learn and improve
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Listing Boost guides
            </h2>
            <p className={`mt-2 max-w-2xl ${mutedTextClass}`}>
              Practical guidance to help you present your accommodation
              clearly and manage student enquiries.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {guides.map((guide, index) => {
              const Icon = guide.icon;

              return (
                <article
                  key={guide.title}
                  className={`${panelClass} flex flex-col p-5 transition duration-200 hover:-translate-y-1 hover:shadow-md`}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-brand-blue dark:bg-blue-950/40 dark:text-blue-300">
                    <Icon size={22} />
                  </div>

                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Guide {index + 1}
                  </p>

                  <h3 className="mt-1 font-bold">
                    {guide.title}
                  </h3>

                  <p className={`mt-2 flex-1 ${mutedTextClass}`}>
                    {guide.description}
                  </p>

                  {index === 0 ? (
                    <p className="mt-4 text-xs font-semibold text-text-secondary">
                      Promotion details above
                    </p>
                  ) : (
                    <Link
                      href={
                        selectedListing
                          ? `/dashboard/landlord/listings/${selectedListing.id}/edit`
                          : "/dashboard/landlord/listings"
                      }
                      className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-blue hover:underline dark:text-blue-400"
                    >
                      Review your listing <ArrowRight size={14} />
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <div className="mt-10 border-t border-border pt-6">
          <Link
            href="/dashboard/landlord"
            className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition hover:text-text-primary"
          >
            ← Return to landlord dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}