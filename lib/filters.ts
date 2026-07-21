import { listings } from "@/lib/listings";
//import { BUDGET_OPTIONS } from "./constants";

const BUDGET_OPTIONS = [
  {
    label: "Any Budget",
    value: "",
    matches: (_price: number) => true,
  },
  {
    label: "Under $100",
    value: "under-100",
    matches: (price: number) => price < 100,
  },
  {
    label: "$100 - $150",
    value: "100-150",
    matches: (price: number) =>
      price >= 100 && price <= 150,
  },
  {
    label: "$150 - $200",
    value: "150-200",
    matches: (price: number) =>
      price >= 150 && price <= 200,
  },
  {
    label: "$200+",
    value: "200+",
    matches: (price: number) => price >= 200,
  },
];

export function getUniversities() {
    return [...new Set(listings.map((listing) => listing.university))].sort();
}

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

// 4. Filter Listings
type FilterOptions = {
  university?: string;
  roomType?: string;
  budget?: string;
};

export function filterListings({
  university,
  roomType,
  budget,
}: FilterOptions) {
  return listings.filter((listing) => {
    const matchesUniversity =
      !university || listing.university === university;

    const matchesRoom =
      !roomType || listing.roomType === roomType;

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
        matchesBudget = listing.price >= 200;
        break;
    }

    return (
      matchesUniversity &&
      matchesRoom &&
      matchesBudget
    );
  });
}