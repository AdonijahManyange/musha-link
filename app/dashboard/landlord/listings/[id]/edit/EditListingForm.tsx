"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ============================================================
// TYPES
// ============================================================

type University = {
  id: string;
  name: string;
  city: string;
};

type Bathroom = {
  location: "INSIDE" | "OUTSIDE";
  features: string[];
};

type Listing = {
  id: string;

  // Basic information
  title: string;
  address: string;
  suburb: string;
  city: string;
  province: string;
  country: string;

  propertyType: string;

  // Rental information
  monthlyRent: number;
  depositRequired: boolean;
  depositAmount: number | null;
  additionalFees: string | null;
  utilitiesIncluded: string | null;
  internetCharges: string | null;

  roomType: string;
  genderPreference: string;

  // University
  universityId: string;
  distanceToUniversityKm: number | null;

  // Description
  description: string;

  // Amenities
  amenities: string[];

  // Bathrooms
  bathrooms: Bathroom[];

  // Utilities
  internetProvider: string | null;
  waterSource: string | null;
  waterDrinkable: boolean | null;
  solarBackupCapacity: string | null;

  // Coordinates
  latitude: number | null;
  longitude: number | null;

  // Status
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

type Props = {
  listing: Listing;
  universities: University[];
};

// ============================================================
// AMENITIES
// Keep this synchronized with Create Listing
// ============================================================

const AMENITIES = [
  {
    value: "WIFI",
    label: "Wi-Fi",
    icon: "📶",
  },
  {
    value: "SOLAR_POWER",
    label: "Solar Power",
    icon: "☀️",
  },
  {
    value: "BOREHOLE",
    label: "Borehole",
    icon: "🚰",
  },
  {
    value: "ELECTRICITY",
    label: "Electricity",
    icon: "⚡",
  },
  {
    value: "BACKUP_GENERATOR",
    label: "Backup Generator",
    icon: "🔋",
  },
  {
    value: "WATER",
    label: "Water",
    icon: "💧",
  },
  {
    value: "SECURITY",
    label: "Security",
    icon: "🛡️",
  },
  {
    value: "PARKING",
    label: "Parking",
    icon: "🚗",
  },
  {
    value: "FURNISHED",
    label: "Furnished",
    icon: "🛏️",
  },
  {
    value: "LAUNDRY",
    label: "Laundry",
    icon: "🧺",
  },
  {
    value: "KITCHEN",
    label: "Kitchen",
    icon: "🍳",
  },
  {
    value: "STUDY_AREA",
    label: "Study Area",
    icon: "📚",
  },
  {
    value: "GARDEN",
    label: "Garden",
    icon: "🌳",
  },
  {
    value: "SWIMMING_POOL",
    label: "Swimming Pool",
    icon: "🏊",
  },
  {
    value: "SMART_TV",
    label: "Smart TV",
    icon: "📺",
  },
  {
    value: "NETFLIX",
    label: "Netflix",
    icon: "🎬",
  },
  {
    value: "PRIME_VIDEO",
    label: "Prime Video",
    icon: "▶️",
  },
  {
    value: "DSTV",
    label: "DSTV",
    icon: "📡",
  },
];

// ============================================================
// BATHROOM FEATURES
// ============================================================

const BATHROOM_FEATURES = [
  {
    value: "SHOWER",
    label: "Shower",
    icon: "🚿",
  },
  {
    value: "BATHTUB",
    label: "Bathtub",
    icon: "🛁",
  },
  {
    value: "TOILET",
    label: "Toilet",
    icon: "🚽",
  },
  {
    value: "SINK",
    label: "Sink",
    icon: "🚰",
  },
];

// ============================================================
// COMPONENT
// ============================================================

export default function EditListingForm({
  listing,
  universities,
}: Props) {
  const router = useRouter();

  // ============================================================
  // BASIC INFORMATION
  // ============================================================

  const [title, setTitle] = useState(listing.title);

  const [propertyType, setPropertyType] = useState(
    listing.propertyType
  );

  const [address, setAddress] = useState(listing.address);

  const [suburb, setSuburb] = useState(listing.suburb ?? "");

  const [city, setCity] = useState(listing.city);

  const [province, setProvince] = useState(listing.province);

  const [country, setCountry] = useState(listing.country);

  // ============================================================
  // RENTAL INFORMATION
  // ============================================================

  const [monthlyRent, setMonthlyRent] = useState(
    String(listing.monthlyRent)
  );

  const [depositRequired, setDepositRequired] = useState(
    listing.depositRequired ?? false
  );

  const [depositAmount, setDepositAmount] = useState(
    listing.depositAmount !== null &&
      listing.depositAmount !== undefined
      ? String(listing.depositAmount)
      : ""
  );

  const [additionalFees, setAdditionalFees] = useState(
    listing.additionalFees ?? ""
  );

  const [utilitiesIncluded, setUtilitiesIncluded] = useState(
    listing.utilitiesIncluded ?? ""
  );

  const [internetCharges, setInternetCharges] = useState(
    listing.internetCharges ?? ""
  );

  const [roomType, setRoomType] = useState(listing.roomType);

  const [genderPreference, setGenderPreference] = useState(
    listing.genderPreference
  );

  // ============================================================
  // UNIVERSITY
  // ============================================================

  const [universityId, setUniversityId] = useState(
    listing.universityId
  );

  const [distanceToUniversityKm, setDistanceToUniversityKm] =
    useState(
      listing.distanceToUniversityKm !== null &&
        listing.distanceToUniversityKm !== undefined
        ? String(listing.distanceToUniversityKm)
        : ""
    );

  // ============================================================
  // DESCRIPTION
  // ============================================================

  const [description, setDescription] = useState(
    listing.description ?? ""
  );

  // ============================================================
  // AMENITIES
  // ============================================================

  const [amenities, setAmenities] = useState<string[]>(
    listing.amenities ?? []
  );

  // ============================================================
  // BATHROOMS
  // ============================================================

  const [bathrooms, setBathrooms] = useState<Bathroom[]>(
    listing.bathrooms ?? []
  );

  // ============================================================
  // UTILITIES & SERVICES
  // ============================================================

  const [internetProvider, setInternetProvider] = useState(
    listing.internetProvider ?? ""
  );

  const [waterSource, setWaterSource] = useState(
    listing.waterSource ?? ""
  );

  const [waterDrinkable, setWaterDrinkable] = useState<string>(
    listing.waterDrinkable === true
      ? "YES"
      : listing.waterDrinkable === false
        ? "NO"
        : ""
  );

  const [solarBackupCapacity, setSolarBackupCapacity] =
    useState(listing.solarBackupCapacity ?? "");

  // ============================================================
  // COORDINATES
  // ============================================================

  const [latitude, setLatitude] = useState(
    listing.latitude !== null &&
      listing.latitude !== undefined
      ? String(listing.latitude)
      : ""
  );

  const [longitude, setLongitude] = useState(
    listing.longitude !== null &&
      listing.longitude !== undefined
      ? String(listing.longitude)
      : ""
  );

  // ============================================================
  // UI STATE
  // ============================================================

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // ============================================================
  // TOGGLE AMENITY
  // ============================================================

  function toggleAmenity(amenity: string) {
    setAmenities((current) =>
      current.includes(amenity)
        ? current.filter((item) => item !== amenity)
        : [...current, amenity]
    );
  }

  // ============================================================
  // ADD BATHROOM
  // ============================================================

  function addBathroom() {
    setBathrooms((current) => [
      ...current,
      {
        location: "INSIDE",
        features: [],
      },
    ]);
  }

  // ============================================================
  // REMOVE BATHROOM
  // ============================================================

  function removeBathroom(index: number) {
    setBathrooms((current) =>
      current.filter((_, bathroomIndex) => bathroomIndex !== index)
    );
  }

  // ============================================================
  // UPDATE BATHROOM LOCATION
  // ============================================================

  function updateBathroomLocation(
    index: number,
    location: "INSIDE" | "OUTSIDE"
  ) {
    setBathrooms((current) =>
      current.map((bathroom, bathroomIndex) =>
        bathroomIndex === index
          ? {
              ...bathroom,
              location,
            }
          : bathroom
      )
    );
  }

  // ============================================================
  // TOGGLE BATHROOM FEATURE
  // ============================================================

  function toggleBathroomFeature(
    bathroomIndex: number,
    feature: string
  ) {
    setBathrooms((current) =>
      current.map((bathroom, index) => {
        if (index !== bathroomIndex) {
          return bathroom;
        }

        const features = bathroom.features.includes(feature)
          ? bathroom.features.filter(
              (item) => item !== feature
            )
          : [...bathroom.features, feature];

        return {
          ...bathroom,
          features,
        };
      })
    );
  }

  // ============================================================
  // SUBMIT
  // ============================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `/api/listings/${listing.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            // ==================================================
            // BASIC INFORMATION
            // ==================================================

            title,
            propertyType,
            address,
            suburb,
            city,
            province,
            country,

            // ==================================================
            // RENTAL INFORMATION
            // ==================================================

            monthlyRent: Number(monthlyRent),

            depositRequired,

            depositAmount:
              depositRequired && depositAmount !== ""
                ? Number(depositAmount)
                : null,

            additionalFees:
              additionalFees.trim() || null,

            utilitiesIncluded:
              utilitiesIncluded.trim() || null,

            internetCharges:
              internetCharges.trim() || null,

            roomType,
            genderPreference,

            // ==================================================
            // UNIVERSITY
            // ==================================================

            universityId,

            distanceToUniversityKm:
              distanceToUniversityKm === ""
                ? null
                : Number(distanceToUniversityKm),

            // ==================================================
            // DESCRIPTION
            // ==================================================

            description,

            // ==================================================
            // AMENITIES
            // ==================================================

            amenities,

            // ==================================================
            // BATHROOMS
            // ==================================================

            bathrooms,

            // ==================================================
            // UTILITIES & SERVICES
            // ==================================================

            internetProvider:
              internetProvider.trim() || null,

            waterSource:
              waterSource.trim() || null,

            waterDrinkable:
              waterDrinkable === "YES"
                ? true
                : waterDrinkable === "NO"
                  ? false
                  : null,

            solarBackupCapacity:
              solarBackupCapacity.trim() || null,

            // ==================================================
            // COORDINATES
            // ==================================================

            latitude:
              latitude === ""
                ? null
                : Number(latitude),

            longitude:
              longitude === ""
                ? null
                : Number(longitude),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update listing."
        );
      }

      setSuccess("Listing updated successfully.");

      setTimeout(() => {
        router.push("/dashboard/landlord/listings");
        router.refresh();
      }, 700);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving your listing."
      );

      setSaving(false);
    }
  }

  // ============================================================
  // STYLES
  // ============================================================

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20";

  const selectClass =
    "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20";

  const labelClass =
    "block text-sm font-medium text-slate-700";

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* ====================================================== */}
      {/* ERROR */}
      {/* ====================================================== */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ====================================================== */}
      {/* SUCCESS */}
      {/* ====================================================== */}

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {/* ====================================================== */}
      {/* PROPERTY INFORMATION */}
      {/* ====================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Property Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Update the basic information about your property.
        </p>

        <div className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="title"
              className={labelClass}
            >
              Property Title
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              required
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="propertyType"
              className={labelClass}
            >
              Property Type
            </label>

            <select
              id="propertyType"
              value={propertyType}
              onChange={(event) =>
                setPropertyType(event.target.value)
              }
              required
              className={selectClass}
            >
              <option value="HOUSE">House</option>
              <option value="FLAT">Flat</option>
              <option value="APARTMENT">Apartment</option>
              <option value="TOWNHOUSE">Townhouse</option>
              <option value="COTTAGE">Cottage</option>
              <option value="ROOMING_HOUSE">
                Rooming House
              </option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="address"
              className={labelClass}
            >
              Address
            </label>

            <input
              id="address"
              type="text"
              value={address}
              onChange={(event) =>
                setAddress(event.target.value)
              }
              required
              className={inputClass}
            />

            <p className="mt-1 text-xs text-slate-500">
              Full address is kept private and is not shown
              publicly.
            </p>
          </div>

          <div>
            <label
              htmlFor="suburb"
              className={labelClass}
            >
              Suburb
            </label>

            <input
              id="suburb"
              type="text"
              value={suburb}
              onChange={(event) =>
                setSuburb(event.target.value)
              }
              required
              className={inputClass}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="city"
                className={labelClass}
              >
                City
              </label>

              <input
                id="city"
                type="text"
                value={city}
                onChange={(event) =>
                  setCity(event.target.value)
                }
                required
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="province"
                className={labelClass}
              >
                Province
              </label>

              <input
                id="province"
                type="text"
                value={province}
                onChange={(event) =>
                  setProvince(event.target.value)
                }
                required
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="country"
              className={labelClass}
            >
              Country
            </label>

            <input
              id="country"
              type="text"
              value={country}
              onChange={(event) =>
                setCountry(event.target.value)
              }
              required
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* RENTAL INFORMATION */}
      {/* ====================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Rental Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Provide the full cost information students
          should know before booking.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="monthlyRent"
              className={labelClass}
            >
              Monthly Rent
            </label>

            <input
              id="monthlyRent"
              type="number"
              min="1"
              step="1"
              value={monthlyRent}
              onChange={(event) =>
                setMonthlyRent(event.target.value)
              }
              required
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="roomType"
              className={labelClass}
            >
              Room Type
            </label>

            <select
              id="roomType"
              value={roomType}
              onChange={(event) =>
                setRoomType(event.target.value)
              }
              required
              className={selectClass}
            >
              <option value="PRIVATE">
                Private Room
              </option>

              <option value="SHARED">
                Shared Room
              </option>

              <option value="ENTIRE_PROPERTY">
                Entire Property
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="depositRequired"
              className={labelClass}
            >
              Security Deposit Required
            </label>

            <select
              id="depositRequired"
              value={depositRequired ? "YES" : "NO"}
              onChange={(event) => {
                const required =
                  event.target.value === "YES";

                setDepositRequired(required);

                if (!required) {
                  setDepositAmount("");
                }
              }}
              className={selectClass}
            >
              <option value="NO">No</option>
              <option value="YES">Yes</option>
            </select>
          </div>

          {depositRequired && (
            <div>
              <label
                htmlFor="depositAmount"
                className={labelClass}
              >
                Deposit Amount
              </label>

              <input
                id="depositAmount"
                type="number"
                min="0"
                step="1"
                value={depositAmount}
                onChange={(event) =>
                  setDepositAmount(event.target.value)
                }
                className={inputClass}
              />
            </div>
          )}

          <div>
            <label
              htmlFor="genderPreference"
              className={labelClass}
            >
              Gender Preference
            </label>

            <select
              id="genderPreference"
              value={genderPreference}
              onChange={(event) =>
                setGenderPreference(event.target.value)
              }
              required
              className={selectClass}
            >
              <option value="ANY">Any Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="additionalFees"
              className={labelClass}
            >
              Additional Fees
            </label>

            <input
              id="additionalFees"
              type="text"
              value={additionalFees}
              onChange={(event) =>
                setAdditionalFees(event.target.value)
              }
              className={inputClass}
              placeholder="e.g. $20 cleaning fee"
            />
          </div>

          <div>
            <label
              htmlFor="utilitiesIncluded"
              className={labelClass}
            >
              Utilities Included
            </label>

            <input
              id="utilitiesIncluded"
              type="text"
              value={utilitiesIncluded}
              onChange={(event) =>
                setUtilitiesIncluded(event.target.value)
              }
              className={inputClass}
              placeholder="e.g. Water, electricity"
            />
          </div>

          <div>
            <label
              htmlFor="internetCharges"
              className={labelClass}
            >
              Internet Charges
            </label>

            <input
              id="internetCharges"
              type="text"
              value={internetCharges}
              onChange={(event) =>
                setInternetCharges(event.target.value)
              }
              className={inputClass}
              placeholder="e.g. Included / $20 monthly"
            />
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* AMENITIES */}
      {/* ====================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Amenities & Facilities
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Select everything available at the property.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {AMENITIES.map((amenity) => {
            const selected = amenities.includes(
              amenity.value
            );

            return (
              <label
                key={amenity.value}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                  selected
                    ? "border-brand-blue bg-blue-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() =>
                    toggleAmenity(amenity.value)
                  }
                  className="h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                />

                <span className="text-lg">
                  {amenity.icon}
                </span>

                <span className="text-sm font-medium text-slate-700">
                  {amenity.label}
                </span>
              </label>
            );
          })}
        </div>

        <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3">
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">
              {amenities.length}
            </span>{" "}
            {amenities.length === 1
              ? "amenity"
              : "amenities"}{" "}
            selected.
          </p>
        </div>
      </section>

      {/* ====================================================== */}
      {/* BATHROOMS */}
      {/* ====================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Bathrooms
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add each bathroom and specify its location
              and available features.
            </p>
          </div>

          <button
            type="button"
            onClick={addBathroom}
            className="rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-blue-dark"
          >
            + Add Bathroom
          </button>
        </div>

        {bathrooms.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
            <p className="text-sm text-slate-500">
              No bathrooms added yet.
            </p>

            <button
              type="button"
              onClick={addBathroom}
              className="mt-3 text-sm font-semibold text-brand-blue hover:underline"
            >
              Add your first bathroom
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {bathrooms.map((bathroom, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-slate-900">
                    Bathroom {index + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() =>
                      removeBathroom(index)
                    }
                    className="text-sm font-semibold text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-5">
                  <label
                    htmlFor={`bathroom-location-${index}`}
                    className={labelClass}
                  >
                    Bathroom Location
                  </label>

                  <select
                    id={`bathroom-location-${index}`}
                    value={bathroom.location}
                    onChange={(event) =>
                      updateBathroomLocation(
                        index,
                        event.target.value as
                          | "INSIDE"
                          | "OUTSIDE"
                      )
                    }
                    className={selectClass}
                  >
                    <option value="INSIDE">
                      Inside the Property
                    </option>

                    <option value="OUTSIDE">
                      Outside the Property
                    </option>
                  </select>
                </div>

                <div className="mt-5">
                  <p className={labelClass}>
                    Bathroom Features
                  </p>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {BATHROOM_FEATURES.map(
                      (feature) => {
                        const selected =
                          bathroom.features.includes(
                            feature.value
                          );

                        return (
                          <label
                            key={feature.value}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl border bg-white p-3 transition ${
                              selected
                                ? "border-brand-blue bg-blue-50"
                                : "border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() =>
                                toggleBathroomFeature(
                                  index,
                                  feature.value
                                )
                              }
                              className="h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                            />

                            <span className="text-lg">
                              {feature.icon}
                            </span>

                            <span className="text-sm font-medium text-slate-700">
                              {feature.label}
                            </span>
                          </label>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3">
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">
              {bathrooms.length}
            </span>{" "}
            {bathrooms.length === 1
              ? "bathroom"
              : "bathrooms"}{" "}
            added.
          </p>
        </div>
      </section>

      {/* ====================================================== */}
      {/* UNIVERSITY */}
      {/* ====================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          University
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Connect this property to the university
          students are searching for.
        </p>

        <div className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="universityId"
              className={labelClass}
            >
              University
            </label>

            <select
              id="universityId"
              value={universityId}
              onChange={(event) =>
                setUniversityId(event.target.value)
              }
              required
              className={selectClass}
            >
              {universities.map((university) => (
                <option
                  key={university.id}
                  value={university.id}
                >
                  {university.name} — {university.city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="distanceToUniversityKm"
              className={labelClass}
            >
              Distance to University (km)
            </label>

            <input
              id="distanceToUniversityKm"
              type="number"
              min="0"
              step="0.1"
              value={distanceToUniversityKm}
              onChange={(event) =>
                setDistanceToUniversityKm(
                  event.target.value
                )
              }
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* UTILITIES & SERVICES */}
      {/* ====================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Utilities & Services
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Provide accurate information about internet,
          water, and backup power available at the property.
        </p>

        <div className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="internetProvider"
              className={labelClass}
            >
              Internet Service Provider
            </label>

            <input
              id="internetProvider"
              type="text"
              value={internetProvider}
              onChange={(event) =>
                setInternetProvider(
                  event.target.value
                )
              }
              className={inputClass}
              placeholder="e.g. Starlink"
            />
          </div>

          <div>
            <label
              htmlFor="waterSource"
              className={labelClass}
            >
              Water Source
            </label>

            <input
              id="waterSource"
              type="text"
              value={waterSource}
              onChange={(event) =>
                setWaterSource(event.target.value)
              }
              className={inputClass}
              placeholder="e.g. Tap Fresh Water"
            />
          </div>

          <div>
            <label
              htmlFor="waterDrinkable"
              className={labelClass}
            >
              Drinkable Water
            </label>

            <select
              id="waterDrinkable"
              value={waterDrinkable}
              onChange={(event) =>
                setWaterDrinkable(event.target.value)
              }
              className={selectClass}
            >
              <option value="">Select</option>
              <option value="YES">Yes</option>
              <option value="NO">No</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="solarBackupCapacity"
              className={labelClass}
            >
              Solar Backup Capacity
            </label>

            <input
              id="solarBackupCapacity"
              type="text"
              value={solarBackupCapacity}
              onChange={(event) =>
                setSolarBackupCapacity(
                  event.target.value
                )
              }
              className={inputClass}
              placeholder="e.g. 5kVA"
            />
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* DESCRIPTION */}
      {/* ====================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Description
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Tell students what makes this property
          suitable for them.
        </p>

        <div className="mt-6">
          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            rows={7}
            required
            className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            placeholder="Describe the property, rooms, location, and anything students should know..."
          />
        </div>
      </section>

      {/* ====================================================== */}
      {/* COORDINATES */}
      {/* ====================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Location Coordinates
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Optional. These can be used later for displaying
          the property on a map.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="latitude"
              className={labelClass}
            >
              Latitude
            </label>

            <input
              id="latitude"
              type="number"
              step="any"
              value={latitude}
              onChange={(event) =>
                setLatitude(event.target.value)
              }
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="longitude"
              className={labelClass}
            >
              Longitude
            </label>

            <input
              id="longitude"
              type="number"
              step="any"
              value={longitude}
              onChange={(event) =>
                setLongitude(event.target.value)
              }
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* ACTIONS */}
      {/* ====================================================== */}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/dashboard/landlord/listings"
          className="rounded-xl border border-slate-300 px-6 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-brand-blue px-6 py-3 font-semibold text-white transition hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving
            ? "Saving Changes..."
            : "Save Changes"}
        </button>
      </div>
    </form>
  );
}