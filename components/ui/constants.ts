// ======================================================
// MushaLink Constants
// Shared configuration used across the application.
// ======================================================



// ======================================================
// Search Filters
// ======================================================

export const BUDGET_OPTIONS = [
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



// ======================================================
// Property Types
// (Future)
// ======================================================

// export const PROPERTY_TYPES = [
//   "Private Room",
//   "Shared Room",
//   "Apartment",
//   "House",
// ];



// ======================================================
// Amenities
// (Future)
// ======================================================

// export const AMENITIES = [
//   "Wi-Fi",
//   "Solar",
//   "Borehole",
//   "Parking",
// ];



// ======================================================
// Universities
// (Future)
// ======================================================

// export const UNIVERSITIES = [];



// ======================================================
// Cities
// (Future)
// ======================================================

// export const CITIES = [];



// ======================================================
// Sorting
// (Future)
// ======================================================

// export const SORT_OPTIONS = [];