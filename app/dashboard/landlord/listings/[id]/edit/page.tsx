"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type University = {
  id: string;
  name: string;
  city: string;
};

type Listing = {
  id: string;
  title: string;
  propertyType: string;
  address: string;
  suburb: string;
  city: string;
  province: string;
  country: string;
  monthlyRent: number;

  depositRequired: boolean;
  depositAmount: number | null;
  additionalFees: string | null;
  utilitiesIncluded: string | null;
  internetCharges: string | null;

  internetProvider: string | null;
  waterSource: string | null;
  waterDrinkable: boolean | null;
  solarBackupCapacity: string | null;

  roomType: string;
  genderPreference: string;
  universityId: string;
  distanceToUniversityKm: number | null;
  description: string;
  latitude: number | null;
  longitude: number | null;
  amenities: string[];
  university: University;
};

// ============================================================
// AMENITIES
// ============================================================

const AMENITIES = [
  {
    value: "WIFI",
    label: "Wi-Fi",
    emoji: "📶",
  },
  {
    value: "SOLAR_POWER",
    label: "Solar Power",
    emoji: "☀️",
  },
  {
    value: "BOREHOLE",
    label: "Borehole",
    emoji: "🚰",
  },
  {
    value: "ELECTRICITY",
    label: "Electricity",
    emoji: "⚡",
  },
  {
    value: "BACKUP_GENERATOR",
    label: "Backup Generator",
    emoji: "🔋",
  },
  {
    value: "WATER",
    label: "Water",
    emoji: "💧",
  },
  {
    value: "SECURITY",
    label: "Security",
    emoji: "🛡️",
  },
  {
    value: "PARKING",
    label: "Parking",
    emoji: "🚗",
  },
  {
    value: "FURNISHED",
    label: "Furnished",
    emoji: "🛏️",
  },
  {
    value: "LAUNDRY",
    label: "Laundry",
    emoji: "🧺",
  },
  {
    value: "KITCHEN",
    label: "Kitchen",
    emoji: "🍳",
  },
  {
    value: "STUDY_AREA",
    label: "Study Area",
    emoji: "📚",
  },
  {
    value: "GARDEN",
    label: "Garden",
    emoji: "🌳",
  },
  {
    value: "SWIMMING_POOL",
    label: "Swimming Pool",
    emoji: "🏊",
  },
  {
    value: "DSTV",
    label: "DSTV",
    emoji: "📺",
  },
];

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();

  const listingId = params.id as string;

  const [listing, setListing] =
    useState<Listing | null>(null);

  const [universities, setUniversities] =
    useState<University[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [formData, setFormData] = useState({
    title: "",
    propertyType: "",
    address: "",
    suburb: "",
    city: "",
    province: "",
    country: "",
    monthlyRent: "",

    depositRequired: "",
    depositAmount: "",
    additionalFees: "",
    utilitiesIncluded: "",
    internetCharges: "",

    internetProvider: "",
    waterSource: "",
    waterDrinkable: "",
    solarBackupCapacity: "",

    roomType: "",
    genderPreference: "",
    universityId: "",
    distanceToUniversityKm: "",
    description: "",
    latitude: "",
    longitude: "",
    amenities: [] as string[],
  });

  // ============================================================
  // LOAD LISTING
  // ============================================================

  useEffect(() => {
    async function loadListing() {
      try {
        const response = await fetch(
          `/api/listings/${listingId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to load listing."
          );
        }

        const loadedListing =
          data.listing;

        setListing(loadedListing);

        setFormData({
          title:
            loadedListing.title || "",

          propertyType:
            loadedListing.propertyType || "",

          address:
            loadedListing.address || "",

          suburb:
            loadedListing.suburb || "",

          city:
            loadedListing.city || "",

          province:
            loadedListing.province || "",

          country:
            loadedListing.country || "",

          monthlyRent:
            loadedListing.monthlyRent?.toString() ||
            "",

          depositRequired:
            loadedListing.depositRequired
              ? "yes"
              : "no",

          depositAmount:
            loadedListing.depositAmount?.toString() ||
            "",

          additionalFees:
            loadedListing.additionalFees || "",

          utilitiesIncluded:
            loadedListing.utilitiesIncluded || "",

          internetCharges:
            loadedListing.internetCharges || "",

          internetProvider:
            loadedListing.internetProvider || "",

          waterSource:
            loadedListing.waterSource || "",

          waterDrinkable:
            loadedListing.waterDrinkable === true
              ? "yes"
              : loadedListing.waterDrinkable === false
                ? "no"
                : "unknown",

          solarBackupCapacity:
            loadedListing.solarBackupCapacity || "",

          roomType:
            loadedListing.roomType || "",

          genderPreference:
            loadedListing.genderPreference ||
            "",

          universityId:
            loadedListing.universityId || "",

          distanceToUniversityKm:
            loadedListing.distanceToUniversityKm?.toString() ||
            "",

          description:
            loadedListing.description || "",

          latitude:
            loadedListing.latitude?.toString() ||
            "",

          longitude:
            loadedListing.longitude?.toString() ||
            "",

          // Load existing amenities.
          // These will automatically appear checked
          // when the landlord opens Edit Listing.
          amenities:
            Array.isArray(
              loadedListing.amenities
            )
              ? loadedListing.amenities
              : [],
        });
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load listing."
        );
      } finally {
        setLoading(false);
      }
    }

    async function loadUniversities() {
      try {
        const response = await fetch(
          "/api/universities"
        );

        if (!response.ok) {
          return;
        }

        const data =
          await response.json();

        setUniversities(data);
      } catch (error) {
        console.error(
          "Failed to load universities:",
          error
        );
      }
    }

    loadListing();
    loadUniversities();
  }, [listingId]);

  // ============================================================
  // HANDLE INPUT
  // ============================================================

  function handleChange(
    field: keyof typeof formData,
    value: string
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  // ============================================================
  // TOGGLE AMENITY
  // ============================================================

  function toggleAmenity(
    amenity: string
  ) {
    setFormData((current) => ({
      ...current,

      amenities: current.amenities.includes(
        amenity
      )
        ? current.amenities.filter(
            (item) => item !== amenity
          )
        : [
            ...current.amenities,
            amenity,
          ],
    }));
  }

  // ============================================================
  // SAVE CHANGES
  // ============================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `/api/listings/${listingId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            title:
              formData.title,

            propertyType:
              formData.propertyType,

            address:
              formData.address,

            suburb:
              formData.suburb,

            city:
              formData.city,

            province:
              formData.province,

            country:
              formData.country,

            monthlyRent:
              Number(
                formData.monthlyRent
              ),

            depositRequired:
              formData.depositRequired === "yes",

            depositAmount:
              formData.depositRequired === "yes"
                ? formData.depositAmount
                : null,

            additionalFees:
              formData.additionalFees,

            utilitiesIncluded:
              formData.utilitiesIncluded,

            internetCharges:
              formData.internetCharges,

            internetProvider:
              formData.internetProvider || null,

            waterSource:
              formData.waterSource || null,

            waterDrinkable:
              formData.waterDrinkable === "yes"
                ? true
                : formData.waterDrinkable === "no"
                  ? false
                  : null,

            solarBackupCapacity:
              formData.solarBackupCapacity || null,

            roomType:
              formData.roomType,

            genderPreference:
              formData.genderPreference,

            universityId:
              formData.universityId,

            description:
              formData.description,

            // Send selected amenities
            // to the API.
            amenities:
              formData.amenities,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to save changes."
        );
      }

      router.push(
        "/dashboard/landlord/listings"
      );

      router.refresh();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving."
      );
    } finally {
      setSaving(false);
    }
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-600">
              Loading listing...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (!listing) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/dashboard/landlord/listings"
            className="text-sm font-medium text-slate-600 hover:text-brand-blue"
          >
            ← Back to My Listings
          </Link>

          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error ||
              "Listing could not be found."}
          </div>
        </div>
      </main>
    );
  }

  // ============================================================
  // FORM
  // ============================================================

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">

        {/* ==================================================
            BACK
        ================================================== */}

        <Link
          href="/dashboard/landlord/listings"
          className="text-sm font-medium text-slate-600 transition hover:text-brand-blue"
        >
          ← Back to My Listings
        </Link>

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-blue">
            Landlord Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Edit Listing
          </h1>

          <p className="mt-2 text-slate-600">
            Update the details for{" "}
            <span className="font-semibold">
              {listing.title}
            </span>
            .
          </p>
        </div>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >

          {/* ==================================================
              PROPERTY INFORMATION
          ================================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-slate-900">
              Property Information
            </h2>

            <div className="mt-6 space-y-5">

              {/* Title */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Property Title
                </label>

                <input
                  type="text"
                  value={
                    formData.title
                  }
                  onChange={(e) =>
                    handleChange(
                      "title",
                      e.target.value
                    )
                  }
                  required
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>

              {/* Property Type */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Property Type
                </label>

                <select
                  value={
                    formData.propertyType
                  }
                  onChange={(e) =>
                    handleChange(
                      "propertyType",
                      e.target.value
                    )
                  }
                  required
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                >
                  <option value="HOUSE">
                    House
                  </option>

                  <option value="FLAT">
                    Flat
                  </option>

                  <option value="APARTMENT">
                    Apartment
                  </option>

                  <option value="TOWNHOUSE">
                    Townhouse
                  </option>

                  <option value="COTTAGE">
                    Cottage
                  </option>

                  <option value="ROOMING_HOUSE">
                    Rooming House
                  </option>

                  <option value="OTHER">
                    Other
                  </option>
                </select>
              </div>

              {/* Address */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Address
                </label>

                <input
                  type="text"
                  value={
                    formData.address
                  }
                  onChange={(e) =>
                    handleChange(
                      "address",
                      e.target.value
                    )
                  }
                  required
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>

              {/* Suburb */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Suburb
                </label>

                <input
                  type="text"
                  value={formData.suburb}
                  onChange={(e) =>
                    handleChange(
                      "suburb",
                      e.target.value
                    )
                  }
                  required
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>

              {/* City / Province */}

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    City
                  </label>

                  <input
                    type="text"
                    value={
                      formData.city
                    }
                    onChange={(e) =>
                      handleChange(
                        "city",
                        e.target.value
                      )
                    }
                    required
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Province
                  </label>

                  <input
                    type="text"
                    value={
                      formData.province
                    }
                    onChange={(e) =>
                      handleChange(
                        "province",
                        e.target.value
                      )
                    }
                    required
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>

              </div>

              {/* Country */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Country
                </label>

                <input
                  type="text"
                  value={
                    formData.country
                  }
                  onChange={(e) =>
                    handleChange(
                      "country",
                      e.target.value
                    )
                  }
                  required
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>

            </div>
          </section>

          {/* ==================================================
              RENTAL INFORMATION
          ================================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-slate-900">
              Rental Information
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">

              {/* Rent */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Monthly Rent
                </label>

                <input
                  type="number"
                  min="0"
                  value={
                    formData.monthlyRent
                  }
                  onChange={(e) =>
                    handleChange(
                      "monthlyRent",
                      e.target.value
                    )
                  }
                  required
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>

              {/* Room Type */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Room Type
                </label>

                <select
                  value={
                    formData.roomType
                  }
                  onChange={(e) =>
                    handleChange(
                      "roomType",
                      e.target.value
                    )
                  }
                  required
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
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

            </div>

            {/* ==================================================
                PRICING & COSTS
            ================================================== */}

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">

              <h3 className="text-base font-semibold text-slate-900">
                Pricing & Costs
              </h3>

              <div className="mt-5 space-y-5">

                {/* Deposit Required */}

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Security Deposit Required?
                  </label>

                  <select
                    value={formData.depositRequired}
                    onChange={(e) =>
                      handleChange(
                        "depositRequired",
                        e.target.value
                      )
                    }
                    required
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                  >
                    <option value="">
                      Select an option
                    </option>

                    <option value="yes">
                      Yes
                    </option>

                    <option value="no">
                      No
                    </option>
                  </select>
                </div>

                {/* Deposit Amount */}

                {formData.depositRequired === "yes" && (
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Security Deposit Amount
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={formData.depositAmount}
                      onChange={(e) =>
                        handleChange(
                          "depositAmount",
                          e.target.value
                        )
                      }
                      required
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                    />
                  </div>
                )}

                {/* Additional Fees */}

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Additional Fees
                  </label>

                  <textarea
                    value={formData.additionalFees}
                    onChange={(e) =>
                      handleChange(
                        "additionalFees",
                        e.target.value
                      )
                    }
                    rows={3}
                    placeholder="List any additional mandatory fees."
                    className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>

                {/* Utilities */}

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Utilities
                  </label>

                  <textarea
                    value={formData.utilitiesIncluded}
                    onChange={(e) =>
                      handleChange(
                        "utilitiesIncluded",
                        e.target.value
                      )
                    }
                    rows={3}
                    required
                    placeholder="State which utilities are included or excluded."
                    className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>

                {/* Internet Charges */}

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Internet Charges
                  </label>

                  <textarea
                    value={formData.internetCharges}
                    onChange={(e) =>
                      handleChange(
                        "internetCharges",
                        e.target.value
                      )
                    }
                    rows={3}
                    placeholder="State any internet charges or included service."
                    className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>

              </div>
            </div>

            {/* Gender */}

            <div className="mt-5">
              <label className="text-sm font-medium text-slate-700">
                Gender Preference
              </label>

              <select
                value={
                  formData.genderPreference
                }
                onChange={(e) =>
                  handleChange(
                    "genderPreference",
                    e.target.value
                  )
                }
                required
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              >
                <option value="ANY">
                  Any Gender
                </option>

                <option value="MALE">
                  Male
                </option>

                <option value="FEMALE">
                  Female
                </option>
              </select>
            </div>

          </section>

          {/* ==================================================
              AMENITIES
          ================================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Amenities & Facilities
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Select everything available at
                the property.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">

              {AMENITIES.map(
                (amenity) => {
                  const selected =
                    formData.amenities.includes(
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
                          toggleAmenity(
                            amenity.value
                          )
                        }
                        className="h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                      />

                      <span className="text-lg leading-none">
                        {amenity.emoji}
                      </span>

                      <span className="text-sm font-medium text-slate-700">
                        {amenity.label}
                      </span>

                    </label>
                  );
                }
              )}

            </div>

            {/* Selected Count */}

            <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">
                  {formData.amenities.length}
                </span>{" "}
                {formData.amenities.length ===
                1
                  ? "amenity"
                  : "amenities"}{" "}
                selected.
              </p>
            </div>

          </section>

          {/* ==================================================
              UTILITIES & SERVICES
          ================================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-slate-900">
              Utilities & Services
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Provide accurate information about internet,
              water, and backup power available at the property.
            </p>

            <div className="mt-6 space-y-5">

              {/* Internet Provider */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Internet Service Provider
                </label>

                <select
                  value={formData.internetProvider}
                  onChange={(e) =>
                    handleChange(
                      "internetProvider",
                      e.target.value
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                >
                  <option value="">
                    Select a provider
                  </option>

                  <option value="LIQUID_HOME">
                    Liquid Home
                  </option>

                  <option value="TELONE">
                    TelOne
                  </option>

                  <option value="STARLINK">
                    Starlink
                  </option>

                  <option value="UTANDE">
                    Utande
                  </option>

                  <option value="AFRICOM">
                    Africom
                  </option>

                  <option value="POWERTEL">
                    Powertel
                  </option>

                  <option value="DANDEMUTANDE">
                    Dandemutande
                  </option>

                  <option value="ZARNET">
                    Zarnet
                  </option>

                  <option value="ECONET">
                    Econet
                  </option>

                  <option value="NETONE">
                    NetOne
                  </option>

                  <option value="TELECEL">
                    Telecel
                  </option>

                  <option value="OTHER">
                    Other
                  </option>

                  <option value="NONE">
                    No Internet
                  </option>
                </select>
              </div>

              {/* Water Source */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Water Source
                </label>

                <select
                  value={formData.waterSource}
                  onChange={(e) =>
                    handleChange(
                      "waterSource",
                      e.target.value
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                >
                  <option value="">
                    Select a water source
                  </option>

                  <option value="BOREHOLE_FRESH_WATER">
                    Borehole Fresh Water
                  </option>

                  <option value="TAP_FRESH_WATER">
                    Tap Fresh Water
                  </option>

                  <option value="BOREHOLE_AND_TAP">
                    Borehole + Tap
                  </option>

                  <option value="NO_RELIABLE_SUPPLY">
                    No Reliable Water Supply
                  </option>

                  <option value="OTHER">
                    Other
                  </option>
                </select>
              </div>

              {/* Drinkable Water */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Drinkable Water
                </label>

                <select
                  value={formData.waterDrinkable}
                  onChange={(e) =>
                    handleChange(
                      "waterDrinkable",
                      e.target.value
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                >
                  <option value="">
                    Select an option
                  </option>

                  <option value="yes">
                    Yes
                  </option>

                  <option value="no">
                    No
                  </option>

                  <option value="unknown">
                    Unknown
                  </option>
                </select>
              </div>

              {/* Solar Backup */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Solar Backup Capacity
                </label>

                <select
                  value={formData.solarBackupCapacity}
                  onChange={(e) =>
                    handleChange(
                      "solarBackupCapacity",
                      e.target.value
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                >
                  <option value="">
                    Select backup capacity
                  </option>

                  <option value="NONE">
                    No Solar Backup
                  </option>

                  <option value="BASIC_500VA_2KVA">
                    Basic Backup — 500VA–2kVA
                  </option>

                  <option value="STANDARD_3_4KVA">
                    Standard Backup — 3–4kVA
                  </option>

                  <option value="HIGH_CAPACITY_5_6KVA">
                    High-Capacity Backup — 5–6kVA
                  </option>

                  <option value="PREMIUM_7KVA_PLUS">
                    Premium Backup — 7+ kVA
                  </option>
                </select>

                {formData.solarBackupCapacity !== "" &&
                  formData.solarBackupCapacity !== "NONE" && (
                    <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                      <p className="text-sm font-semibold text-yellow-900">
                        ☀️ Solar Backup Guide
                      </p>

                      <p className="mt-2 text-sm leading-6 text-yellow-800">
                        {formData.solarBackupCapacity ===
                          "BASIC_500VA_2KVA" &&
                          "Typically supports lights, Wi-Fi / router, laptops, phones & chargers, and TV."}

                        {formData.solarBackupCapacity ===
                          "STANDARD_3_4KVA" &&
                          "Includes Basic Backup, plus fridge / freezer, multiple devices, multiple laptops, and small household appliances."}

                        {formData.solarBackupCapacity ===
                          "HIGH_CAPACITY_5_6KVA" &&
                          "Includes Standard Backup, plus electric jugs / kettles, irons, washing machines, and multiple household appliances."}

                        {formData.solarBackupCapacity ===
                          "PREMIUM_7KVA_PLUS" &&
                          "Includes High-Capacity Backup, plus higher-power appliances and multiple appliances running together."}
                      </p>

                      <p className="mt-2 text-xs leading-5 text-yellow-700">
                        Actual appliance support may vary depending on the
                        battery, inverter, system configuration, and
                        simultaneous usage.
                      </p>
                    </div>
                  )}
              </div>

            </div>

          </section>

          {/* ==================================================
              UNIVERSITY
          ================================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-slate-900">
              University
            </h2>

            <div className="mt-6 space-y-5">

              {/* University */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  University
                </label>

                <select
                  value={
                    formData.universityId
                  }
                  onChange={(e) =>
                    handleChange(
                      "universityId",
                      e.target.value
                    )
                  }
                  required
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                >
                  {universities.length >
                  0 ? (
                    universities.map(
                      (university) => (
                        <option
                          key={
                            university.id
                          }
                          value={
                            university.id
                          }
                        >
                          {university.name} —{" "}
                          {university.city}
                        </option>
                      )
                    )
                  ) : (
                    <option
                      value={
                        listing.university.id
                      }
                    >
                      {
                        listing.university
                          .name
                      }{" "}
                      —{" "}
                      {
                        listing.university
                          .city
                      }
                    </option>
                  )}
                </select>
              </div>

              {/* Distance */}

              <div>
                <label className="text-sm font-medium text-slate-500">
                  Distance to University (km)
                </label>

                <input
                  type="number"
                  value={
                    formData.distanceToUniversityKm
                  }
                  disabled
                  readOnly
                  className="mt-2 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 outline-none"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Distance is calculated
                  automatically and cannot
                  be edited.
                </p>
              </div>

            </div>
          </section>

          {/* ==================================================
              DESCRIPTION
          ================================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-slate-900">
              Description
            </h2>

            <textarea
              value={
                formData.description
              }
              onChange={(e) =>
                handleChange(
                  "description",
                  e.target.value
                )
              }
              rows={7}
              className="mt-6 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            />

          </section>

          {/* ==================================================
              LOCATION COORDINATES
          ================================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-slate-900">
              Location Coordinates
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Optional. These can be used
              later for displaying the
              property on a map.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">

              {/* Latitude */}

              <div>
                <label className="text-sm font-medium text-slate-500">
                  Latitude
                </label>

                <input
                  type="number"
                  step="any"
                  value={
                    formData.latitude
                  }
                  disabled
                  readOnly
                  className="mt-2 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 outline-none"
                />
              </div>

              {/* Longitude */}

              <div>
                <label className="text-sm font-medium text-slate-500">
                  Longitude
                </label>

                <input
                  type="number"
                  step="any"
                  value={
                    formData.longitude
                  }
                  disabled
                  readOnly
                  className="mt-2 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 outline-none"
                />
              </div>

            </div>

            <p className="mt-4 text-xs text-slate-400">
              Location coordinates are
              managed automatically and
              cannot be edited here.
            </p>

          </section>

          {/* ==================================================
              ACTIONS
          ================================================== */}

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
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>
      </div>
    </main>
  );
}