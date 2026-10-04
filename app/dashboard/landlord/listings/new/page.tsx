"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

// ============================================================
// AMENITIES
// ============================================================

const AMENITIES = [
  { value: "WIFI", label: "Wi-Fi" },
  { value: "SOLAR_POWER", label: "Solar Power" },
  { value: "BOREHOLE", label: "Borehole" },
  { value: "ELECTRICITY", label: "Electricity" },
  { value: "BACKUP_GENERATOR", label: "Backup Generator" },
  { value: "WATER", label: "Water" },
  { value: "SECURITY", label: "Security" },
  { value: "PARKING", label: "Parking" },
  { value: "FURNISHED", label: "Furnished" },
  { value: "LAUNDRY", label: "Laundry" },
  { value: "KITCHEN", label: "Kitchen" },
  { value: "STUDY_AREA", label: "Study Area" },
  { value: "GARDEN", label: "Garden" },
  { value: "SWIMMING_POOL", label: "Swimming Pool" },
  { value: "SMART_TV", label: "Smart TV" },
  { value: "NETFLIX", label: "Netflix" },
  { value: "PRIME_VIDEO", label: "Prime Video" },
  { value: "DSTV", label: "DSTV" },
];

// ============================================================
// BATHROOM FEATURES
// ============================================================

const BATHROOM_FEATURES = [
  { value: "SHOWER", label: "Shower" },
  { value: "BATHTUB", label: "Bathtub" },
  { value: "TOILET", label: "Toilet" },
  { value: "SINK", label: "Sink" },
];

// ============================================================
// REQUIRED FIELD ASTERISK
// ============================================================

function RequiredMark() {
  return (
    <span className="text-red-500" aria-hidden="true">
      {" "}
      *
    </span>
  );
}

// ============================================================
// PAGE
// ============================================================

export default function NewListingPage() {
  const router = useRouter();

  // ==========================================================
  // PROPERTY INFORMATION
  // ==========================================================

  const [propertyTitle, setPropertyTitle] = useState("");
  const [address, setAddress] = useState("");
  const [suburb, setSuburb] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [country, setCountry] = useState("Zimbabwe");

  const [universityId, setUniversityId] = useState("");

  const [rent, setRent] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [roomType, setRoomType] = useState("");
  const [genderPreference, setGenderPreference] = useState("");

  // ==========================================================
  // PRICING
  // ==========================================================

  const [depositRequired, setDepositRequired] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [additionalFees, setAdditionalFees] = useState("");
  const [utilitiesIncluded, setUtilitiesIncluded] = useState("");
  const [internetCharges, setInternetCharges] = useState("");

  // ==========================================================
  // UTILITIES
  // ==========================================================

  const [internetProvider, setInternetProvider] = useState("");
  const [waterSource, setWaterSource] = useState("");
  const [waterDrinkable, setWaterDrinkable] = useState("");
  const [solarBackupCapacity, setSolarBackupCapacity] =
    useState("");

  // ==========================================================
  // DESCRIPTION
  // ==========================================================

  const [description, setDescription] = useState("");

  // ==========================================================
  // AMENITIES
  // ==========================================================

  const [amenities, setAmenities] = useState<string[]>([]);

  // ==========================================================
  // BATHROOMS
  // ==========================================================

  const [bathrooms, setBathrooms] = useState<Bathroom[]>([]);

  // ==========================================================
  // UNIVERSITIES
  // ==========================================================

  const [universities, setUniversities] = useState<
    University[]
  >([]);

  const [loadingUniversities, setLoadingUniversities] =
    useState(true);

  // ==========================================================
  // PAGE STATE
  // ==========================================================

  const [loading, setLoading] = useState(false);

  const [checkingVerification, setCheckingVerification] =
    useState(true);

  // ==========================================================
  // CHECK LANDLORD VERIFICATION
  // ==========================================================

  useEffect(() => {
    async function checkVerification() {
      try {
        const response = await fetch(
          "/api/landlord/verification/status"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to check verification status."
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        setCheckingVerification(false);
      }
    }

    checkVerification();
  }, []);

  // ==========================================================
  // LOAD UNIVERSITIES
  // ==========================================================

  useEffect(() => {
    async function loadUniversities() {
      try {
        const response =
          await fetch("/api/universities");

        if (!response.ok) {
          throw new Error(
            "Failed to load universities."
          );
        }

        const data = await response.json();

        setUniversities(data);
      } catch (error) {
        console.error(error);

        alert(
          "Unable to load universities."
        );
      } finally {
        setLoadingUniversities(false);
      }
    }

    loadUniversities();
  }, []);

  // ==========================================================
  // AMENITY TOGGLE
  // ==========================================================

  function toggleAmenity(amenity: string) {
    setAmenities((current) =>
      current.includes(amenity)
        ? current.filter(
            (item) => item !== amenity
          )
        : [...current, amenity]
    );
  }

  // ==========================================================
  // BATHROOM FUNCTIONS
  // ==========================================================

  function addBathroom() {
    setBathrooms((current) => [
      ...current,
      {
        location: "INSIDE",
        features: [],
      },
    ]);
  }

  function removeBathroom(index: number) {
    setBathrooms((current) =>
      current.filter(
        (_, bathroomIndex) =>
          bathroomIndex !== index
      )
    );
  }

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

  function toggleBathroomFeature(
    bathroomIndex: number,
    feature: string
  ) {
    setBathrooms((current) =>
      current.map((bathroom, index) => {
        if (index !== bathroomIndex) {
          return bathroom;
        }

        const features =
          bathroom.features.includes(feature)
            ? bathroom.features.filter(
                (item) => item !== feature
              )
            : [
                ...bathroom.features,
                feature,
              ];

        return {
          ...bathroom,
          features,
        };
      })
    );
  }

  // ==========================================================
  // SAVE DRAFT
  // ==========================================================

  async function saveDraft() {
    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch(
        "/api/listings",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            saveAsDraft: true,

            title:
              propertyTitle.trim() || null,

            address:
              address.trim() || null,

            suburb:
              suburb.trim() || null,

            city:
              city.trim() || null,

            province:
              province.trim() || null,

            country:
              country || "Zimbabwe",

            universityId:
              universityId || null,

            monthlyRent:
              rent
                ? Number(rent)
                : null,

            propertyType:
              propertyType || null,

            roomType:
              roomType || null,

            genderPreference:
              genderPreference || null,

            depositRequired:
              depositRequired === "yes"
                ? true
                : depositRequired === "no"
                  ? false
                  : null,

            depositAmount:
              depositAmount
                ? Number(depositAmount)
                : null,

            additionalFees:
              additionalFees.trim() || null,

            utilitiesIncluded:
              utilitiesIncluded.trim() || null,

            internetCharges:
              internetCharges.trim() || null,

            internetProvider:
              internetProvider || null,

            waterSource:
              waterSource || null,

            waterDrinkable:
              waterDrinkable === "yes"
                ? true
                : waterDrinkable === "no"
                  ? false
                  : null,

            solarBackupCapacity:
              solarBackupCapacity || null,

            description:
              description.trim() || null,

            amenities,

            bathrooms,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.error ||
            "Failed to save draft."
        );

        return;
      }

      if (!data.id) {
        alert(
          "Draft was saved, but no listing ID was returned."
        );

        return;
      }

      router.push(
        "/dashboard/landlord/listings"
      );
    } catch (error) {
      console.error(
        "Failed to save listing draft:",
        error
      );

      alert(
        "Something went wrong while saving your draft."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================================
  // SUBMIT LISTING
  // ==========================================================

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);

    try {
      const response =
        await fetch("/api/listings", {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            saveAsDraft: false,

            title: propertyTitle,

            address,
            suburb,
            city,
            province,
            country,

            universityId,

            monthlyRent:
              rent
                ? Number(rent)
                : null,

            depositRequired:
              depositRequired === "yes",

            depositAmount:
              depositRequired === "yes"
                ? Number(depositAmount)
                : null,

            additionalFees,
            utilitiesIncluded,
            internetCharges,

            internetProvider:
              internetProvider || null,

            waterSource:
              waterSource || null,

            waterDrinkable:
              waterDrinkable === "yes"
                ? true
                : waterDrinkable === "no"
                  ? false
                  : null,

            solarBackupCapacity:
              solarBackupCapacity || null,

            propertyType,
            roomType,
            genderPreference,

            description,

            amenities,

            bathrooms,
          }),
        });

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.error ||
            "Failed to create listing."
        );

        return;
      }

      if (!data.id) {
        alert(
          "Listing was created, but we could not find its ID."
        );

        return;
      }

      router.push(
        `/dashboard/landlord/listings/${data.id}/photos`
      );
    } catch (error) {
      console.error(
        "Failed to create listing:",
        error
      );

      alert(
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="mb-8">
          <Link
            href="/dashboard/landlord/listings"
            className="text-sm font-medium text-slate-600 hover:text-brand-blue"
          >
            ← Back to My Listings
          </Link>

          <p className="mt-6 text-sm font-medium text-brand-blue">
            Landlord Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Add a Property
          </h1>

          <div className="mt-2 text-slate-600">
            <p>
              Create a listing for students
              looking for accommodation.
            </p>

            <div className="mt-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <span className="text-lg">
                💾
              </span>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Don&apos;t have all the information yet?
                </p>

                <p className="mt-1 text-sm leading-5 text-slate-600">
                  You can save your listing as a
                  draft and come back later to
                  finish it.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* GUIDELINES */}
        {/* ================================================== */}

        <div className="mb-8 rounded-2xl border border-blue-200 bg-blue-50 p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
              📋
            </div>

            <div className="flex-1">
              <h2 className="text-base font-semibold text-slate-900">
                Before You List Your Property
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-700">
                Please review MushaLink&apos;s
                Landlord Listing Guidelines to
                ensure your property meets our
                photo, information, pricing and
                verification requirements.
              </p>

              <a
                href="/MushaLink_Landlord_Listing_Guidelines_Final.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-blue-dark"
              >
                View Landlord Listing Guidelines
                <span className="ml-2">
                  ↗
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* FORM */}
        {/* ================================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* ================================================== */}
          {/* PROPERTY INFORMATION */}
          {/* ================================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Property Information
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Tell students about the property.
            </p>

            <div className="mt-6 space-y-5">

              {/* Property Title */}

              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Property Title
                  <RequiredMark />
                </label>

                <input
                  type="text"
                  value={propertyTitle}
                  onChange={(e) =>
                    setPropertyTitle(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Modern Student House Near Africa University"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>

              {/* Address */}

              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Property Address
                  <RequiredMark />
                </label>

                <div className="space-y-4">

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-600">
                      House Number & Street
                      <RequiredMark />
                    </label>

                    <input
                      type="text"
                      value={address}
                      onChange={(e) =>
                        setAddress(
                          e.target.value
                        )
                      }
                      placeholder="e.g. Murambi Drive"
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-600">
                      Suburb
                      <RequiredMark />
                    </label>

                    <input
                      type="text"
                      value={suburb}
                      onChange={(e) =>
                        setSuburb(
                          e.target.value
                        )
                      }
                      placeholder="e.g. Murambi"
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-600">
                        City
                        <RequiredMark />
                      </label>

                      <input
                        type="text"
                        value={city}
                        onChange={(e) =>
                          setCity(
                            e.target.value
                          )
                        }
                        placeholder="e.g. Mutare"
                        required
                        className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-600">
                        Province
                        <RequiredMark />
                      </label>

                      <input
                        type="text"
                        value={province}
                        onChange={(e) =>
                          setProvince(
                            e.target.value
                          )
                        }
                        placeholder="e.g. Manicaland"
                        required
                        className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-600">
                      Country
                      <RequiredMark />
                    </label>

                    <select
                      value={country}
                      onChange={(e) =>
                        setCountry(
                          e.target.value
                        )
                      }
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                    >
                      <option value="Zimbabwe">
                        Zimbabwe
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* University */}

              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Nearby University
                  <RequiredMark />
                </label>

                <select
                  value={universityId}
                  onChange={(e) =>
                    setUniversityId(
                      e.target.value
                    )
                  }
                  required
                  disabled={
                    loadingUniversities
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  <option value="">
                    {loadingUniversities
                      ? "Loading universities..."
                      : "Select university"}
                  </option>

                  {universities.map(
                    (university) => (
                      <option
                        key={university.id}
                        value={university.id}
                      >
                        {university.name} —{" "}
                        {university.city}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Rent / Property / Room */}

              <div className="grid gap-5 md:grid-cols-3">

                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Monthly Rent
                    <RequiredMark />
                  </label>

                  <input
                    type="number"
                    value={rent}
                    onChange={(e) =>
                      setRent(
                        e.target.value
                      )
                    }
                    placeholder="e.g. 250"
                    min="1"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Property Type
                    <RequiredMark />
                  </label>

                  <select
                    value={propertyType}
                    onChange={(e) =>
                      setPropertyType(
                        e.target.value
                      )
                    }
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                  >
                    <option value="">
                      Select property type
                    </option>

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

                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Room Type
                    <RequiredMark />
                  </label>

                  <select
                    value={roomType}
                    onChange={(e) =>
                      setRoomType(
                        e.target.value
                      )
                    }
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                  >
                    <option value="">
                      Select room type
                    </option>

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

              {/* Gender */}

              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Gender Preference
                  <RequiredMark />
                </label>

                <select
                  value={genderPreference}
                  onChange={(e) =>
                    setGenderPreference(
                      e.target.value
                    )
                  }
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                >
                  <option value="">
                    Select preference
                  </option>

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
            </div>
          </section>

          {/* ================================================== */}
          {/* PRICING */}
          {/* ================================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Pricing & Costs
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Be clear and transparent about
              all costs a student may need to
              pay.
            </p>

            <div className="mt-6 space-y-6">

              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Security Deposit Required?
                  <RequiredMark />
                </label>

                <select
                  value={depositRequired}
                  onChange={(e) => {
                    setDepositRequired(
                      e.target.value
                    );

                    if (
                      e.target.value !==
                      "yes"
                    ) {
                      setDepositAmount("");
                    }
                  }}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
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

              {depositRequired ===
                "yes" && (
                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Security Deposit Amount
                    <RequiredMark />
                  </label>

                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) =>
                      setDepositAmount(
                        e.target.value
                      )
                    }
                    placeholder="e.g. 250"
                    min="1"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Additional Fees
                </label>

                <textarea
                  value={additionalFees}
                  onChange={(e) =>
                    setAdditionalFees(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Cleaning fee: $20/month. No other mandatory fees."
                  rows={3}
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Utilities
                  <RequiredMark />
                </label>

                <textarea
                  value={utilitiesIncluded}
                  onChange={(e) =>
                    setUtilitiesIncluded(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Water and electricity included. Internet excluded."
                  rows={3}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Internet Charges
                </label>

                <textarea
                  value={internetCharges}
                  onChange={(e) =>
                    setInternetCharges(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Wi-Fi included in rent."
                  rows={3}
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>
            </div>
          </section>

          {/* ================================================== */}
          {/* AMENITIES */}
          {/* ================================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Amenities & Facilities
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Select everything available at
              the property.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {AMENITIES.map(
                (amenity) => {
                  const selected =
                    amenities.includes(
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

                      <span className="text-sm font-medium text-slate-700">
                        {amenity.label}
                      </span>
                    </label>
                  );
                }
              )}
            </div>

            {amenities.length > 0 && (
              <p className="mt-4 text-sm text-slate-500">
                {amenities.length}{" "}
                {amenities.length === 1
                  ? "amenity"
                  : "amenities"}{" "}
                selected.
              </p>
            )}
          </section>

          {/* ================================================== */}
          {/* BATHROOMS */}
          {/* ================================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Bathrooms
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Add each bathroom and specify
                  whether it is inside or outside
                  the property, along with the
                  available fixtures.
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
              <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <p className="text-sm font-medium text-slate-700">
                  No bathrooms added yet.
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Click &quot;Add Bathroom&quot; to
                  add the bathrooms available at
                  this property.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                {bathrooms.map(
                  (
                    bathroom,
                    bathroomIndex
                  ) => (
                    <div
                      key={bathroomIndex}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            Bathroom{" "}
                            {bathroomIndex + 1}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            Select the location and
                            fixtures below.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeBathroom(
                              bathroomIndex
                            )
                          }
                          className="text-sm font-semibold text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="mt-5">
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Bathroom Location
                        </label>

                        <select
                          value={
                            bathroom.location
                          }
                          onChange={(e) =>
                            updateBathroomLocation(
                              bathroomIndex,
                              e.target
                                .value as
                                | "INSIDE"
                                | "OUTSIDE"
                            )
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                        >
                          <option value="INSIDE">
                            Inside Property
                          </option>

                          <option value="OUTSIDE">
                            Outside / Separate
                          </option>
                        </select>
                      </div>

                      <div className="mt-5">
                        <label className="mb-3 block text-sm font-medium text-slate-700">
                          Bathroom Features
                        </label>

                        <div className="grid gap-3 sm:grid-cols-2">
                          {BATHROOM_FEATURES.map(
                            (feature) => {
                              const selected =
                                bathroom.features.includes(
                                  feature.value
                                );

                              return (
                                <label
                                  key={
                                    feature.value
                                  }
                                  className={`flex cursor-pointer items-center gap-3 rounded-xl border bg-white p-3 transition ${
                                    selected
                                      ? "border-brand-blue bg-blue-50"
                                      : "border-slate-200 hover:bg-slate-50"
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={
                                      selected
                                    }
                                    onChange={() =>
                                      toggleBathroomFeature(
                                        bathroomIndex,
                                        feature.value
                                      )
                                    }
                                    className="h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                                  />

                                  <span className="text-sm font-medium text-slate-700">
                                    {
                                      feature.label
                                    }
                                  </span>
                                </label>
                              );
                            }
                          )}
                        </div>

                        {bathroom.features
                          .length === 0 && (
                          <p className="mt-3 text-xs text-amber-600">
                            Select at least one
                            bathroom feature.
                          </p>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </section>

          {/* ================================================== */}
          {/* UTILITIES & SERVICES */}
          {/* ================================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-slate-900">
              Utilities & Services
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Tell students about the internet,
              water, electricity, and backup
              power available at this property.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              {/* Internet Provider */}

              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Internet Service Provider
                  <RequiredMark />
                </label>

                <select
                  value={internetProvider}
                  onChange={(e) =>
                    setInternetProvider(
                      e.target.value
                    )
                  }
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                >
                  <option value="">
                    Select internet provider
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

              {/* Water */}

              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Water Source
                  <RequiredMark />
                </label>

                <select
                  value={waterSource}
                  onChange={(e) =>
                    setWaterSource(
                      e.target.value
                    )
                  }
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                >
                  <option value="">
                    Select water source
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
                <label className="mb-2 block font-medium text-slate-700">
                  Is the Water Drinkable?
                  <RequiredMark />
                </label>

                <select
                  value={waterDrinkable}
                  onChange={(e) =>
                    setWaterDrinkable(
                      e.target.value
                    )
                  }
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
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

              {/* Solar */}

              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  ☀️ Solar Backup Capacity
                  <RequiredMark />
                </label>

                <select
                  value={
                    solarBackupCapacity
                  }
                  onChange={(e) =>
                    setSolarBackupCapacity(
                      e.target.value
                    )
                  }
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                >
                  <option value="">
                    Select solar backup capacity
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
              </div>
            </div>

            {/* Solar Guide */}

            {solarBackupCapacity &&
              solarBackupCapacity !==
                "NONE" && (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">

                  <h3 className="font-semibold text-slate-900">
                    ☀️ Solar Backup Guide
                  </h3>

                  {solarBackupCapacity ===
                    "BASIC_500VA_2KVA" && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-slate-800">
                        Basic Backup —
                        500VA–2kVA
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        Essential power for
                        everyday needs.
                      </p>

                      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
                        <li>Lights</li>
                        <li>Wi-Fi / Router</li>
                        <li>Laptops</li>
                        <li>Phones & chargers</li>
                        <li>TV</li>
                      </ul>
                    </div>
                  )}

                  {solarBackupCapacity ===
                    "STANDARD_3_4KVA" && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-slate-800">
                        Standard Backup —
                        3–4kVA
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        Includes Basic Backup,
                        plus:
                      </p>

                      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
                        <li>Fridge / Freezer</li>
                        <li>
                          Multiple phones &
                          devices
                        </li>
                        <li>
                          Multiple laptops
                        </li>
                        <li>
                          Small household
                          appliances
                        </li>
                      </ul>
                    </div>
                  )}

                  {solarBackupCapacity ===
                    "HIGH_CAPACITY_5_6KVA" && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-slate-800">
                        High-Capacity Backup —
                        5–6kVA
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        Includes Standard
                        Backup, plus:
                      </p>

                      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
                        <li>
                          Electric Jugs /
                          Kettles
                        </li>
                        <li>Irons</li>
                        <li>
                          Washing Machines
                        </li>
                        <li>
                          Multiple household
                          appliances
                        </li>
                      </ul>
                    </div>
                  )}

                  {solarBackupCapacity ===
                    "PREMIUM_7KVA_PLUS" && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-slate-800">
                        Premium Backup —
                        7+ kVA
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        Includes High-Capacity
                        Backup, plus:
                      </p>

                      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
                        <li>
                          Higher-power
                          appliances
                        </li>
                        <li>
                          Multiple appliances
                          running together
                        </li>
                        <li>
                          Greater overall
                          power capacity
                        </li>
                      </ul>
                    </div>
                  )}

                  <p className="mt-4 text-xs leading-5 text-slate-500">
                    Actual appliance support
                    may vary depending on the
                    property&apos;s solar system,
                    battery capacity, inverter
                    configuration, and
                    simultaneous usage.
                  </p>
                </div>
              )}
          </section>

          {/* ================================================== */}
          {/* DESCRIPTION */}
          {/* ================================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-slate-900">
              Description
              <RequiredMark />
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Describe the property, location,
              facilities, and anything students
              should know.
            </p>

            <div className="mt-6">
              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                placeholder="Describe the property, location, facilities, and anything students should know..."
                rows={6}
                required
                className="w-full resize-none rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>
          </section>

          {/* ================================================== */}
          {/* ACTIONS */}
          {/* ================================================== */}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">

            {/* SAVE DRAFT */}

            <button
              type="button"
              onClick={saveDraft}
              disabled={
                loading ||
                checkingVerification
              }
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading
                ? "Saving Draft..."
                : "💾 Save Draft"}
            </button>

            {/* CANCEL */}

            <Link
              href="/dashboard/landlord/listings"
              className="rounded-xl border border-slate-300 px-6 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>

            {/* CREATE LISTING */}

            <button
              type="submit"
              disabled={
                loading ||
                loadingUniversities ||
                checkingVerification
              }
              className="rounded-xl bg-brand-blue px-6 py-3 font-semibold text-white transition hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading
                ? "Saving Listing..."
                : "Save & Continue to Photos →"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}