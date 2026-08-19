import { listings } from "@/lib/listings";
import { BUDGET_OPTIONS } from "@/lib/constants";
import type { SearchFilters } from "@/types/search";

/**
 * Convert a university name into the URL-friendly slug
 *
 * Example:
 * "Africa University" → "africa-university"
 * "University of Zimbabwe" → "university-of-zimbabwe"
 * "NUST" → "nust"
 * "MSUAS" → "msuas"
 */
export function universitySlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Get all universities used by listings
 */
export function getUniversities() {
  return [...new Set(listings.map((listing) => listing.university))].sort();
}

/**
 * Get room types available for a university
 */
export function getRoomTypes(university?: string) {
  return [
    ...new Set(
      listings
        .filter(
          (listing) =>
            !university || listing.university === university
        )
        .map((listing) => listing.roomType)
    ),
  ].sort();
}

/**
 * Get budget ranges available for a university
 */
export function getBudgetRanges(university?: string) {
  const filteredListings = listings.filter(
    (listing) =>
      !university || listing.university === university
  );

  return BUDGET_OPTIONS.filter((option) => {
    if (option.value === "") return true;

    return filteredListings.some((listing) =>
      option.matches(listing.price)
    );
  });
}

/**
 * Filter listings
 *
 * University can come from either:
 *
 * 1. The search UI:
 *    "Africa University"
 *
 * 2. The URL:
 *    "africa-university"
 */
export function filterListings({
  university,
  roomType,
  budget,
}: SearchFilters) {
  return listings.filter((listing) => {

    const matchesUniversity =
      !university ||
      listing.university === university ||
      universitySlug(listing.university) === university;

    const matchesRoom =
      !roomType ||
      listing.roomType === roomType;

    let matchesBudget = true;

    switch (budget) {
      case "under-100":
        matchesBudget = listing.price < 100;
        break;

      case "100-150":
        matchesBudget =
          listing.price >= 100 &&
          listing.price <= 150;
        break;

      case "150-200":
        matchesBudget =
          listing.price >= 150 &&
          listing.price <= 200;
        break;

      case "200+":
        matchesBudget =
          listing.price >= 200;
        break;
    }

    return (
      matchesUniversity &&
      matchesRoom &&
      matchesBudget
    );
  });
}