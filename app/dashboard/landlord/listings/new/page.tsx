"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type University = {
  id: string;
  name: string;
  city: string;
};

const AMENITIES = [
  {
    value: "WIFI",
    label: "Wi-Fi",
  },
  {
    value: "SOLAR_POWER",
    label: "Solar Power",
  },
  {
    value: "BOREHOLE",
    label: "Borehole",
  },
  {
    value: "ELECTRICITY",
    label: "Electricity",
  },
  {
    value: "BACKUP_GENERATOR",
    label: "Backup Generator",
  },
  {
    value: "WATER",
    label: "Water",
  },
  {
    value: "SECURITY",
    label: "Security",
  },
  {
    value: "PARKING",
    label: "Parking",
  },
  {
    value: "FURNISHED",
    label: "Furnished",
  },
  {
    value: "LAUNDRY",
    label: "Laundry",
  },
  {
    value: "KITCHEN",
    label: "Kitchen",
  },
  {
    value: "STUDY_AREA",
    label: "Study Area",
  },
  {
    value: "GARDEN",
    label: "Garden",
  },
  {
    value: "SWIMMING_POOL",
    label: "Swimming Pool",
  },
  {
    value: "DSTV",
    label: "DSTV",
  },
];

export default function NewListingPage() {
  const router = useRouter();

  const [propertyTitle, setPropertyTitle] =
    useState("");

  const [address, setAddress] =
  useState("");

const [suburb, setSuburb] =
  useState("");

const [city, setCity] =
  useState("");

  const [province, setProvince] =
    useState("");

  const [country, setCountry] =
    useState("Zimbabwe");

  const [universityId, setUniversityId] =
    useState("");

  const [rent, setRent] =
    useState("");

  const [depositRequired, setDepositRequired] =
    useState("");

  const [depositAmount, setDepositAmount] =
    useState("");

  const [additionalFees, setAdditionalFees] =
    useState("");

  const [utilitiesIncluded, setUtilitiesIncluded] =
    useState("");

  const [internetCharges, setInternetCharges] =
    useState("");

  const [solarBackupCapacity, setSolarBackupCapacity] =
    useState("");

  const [internetProvider, setInternetProvider] =
    useState("");

  const [waterSource, setWaterSource] =
    useState("");

  const [waterDrinkable, setWaterDrinkable] =
    useState("");


  const [propertyType, setPropertyType] =
    useState("");

  const [roomType, setRoomType] =
    useState("");

  const [genderPreference, setGenderPreference] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [amenities, setAmenities] =
    useState<string[]>([]);

  const [universities, setUniversities] =
    useState<University[]>([]);

  const [loadingUniversities, setLoadingUniversities] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [checkingVerification, setCheckingVerification] =
    useState(true);

  const [verificationStatus, setVerificationStatus] =
    useState<string | null>(null);


    // ============================================================
// CHECK LANDLORD VERIFICATION
// ============================================================

useEffect(() => {
  async function checkVerification() {
    try {
      const response = await fetch(
        "/api/landlord/verification/status"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to check verification status."
        );
      }

      setVerificationStatus(data.status);
    } catch (error) {
      console.error(error);

      setVerificationStatus("UNKNOWN");
    } finally {
      setCheckingVerification(false);
    }
  }

  checkVerification();
}, []);

  // ============================================================
  // LOAD UNIVERSITIES
  // ============================================================

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

        const data =
          await response.json();

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

  // ============================================================
  // TOGGLE AMENITY
  // ============================================================

  function toggleAmenity(
    amenity: string
  ) {
    setAmenities((current) =>
      current.includes(amenity)
        ? current.filter(
            (item) => item !== amenity
          )
        : [...current, amenity]
    );
  }

  // ============================================================
  // SUBMIT
  // ============================================================

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
            title: propertyTitle,
            address,
            suburb,
            city,
            province,
            country,
            universityId,
            monthlyRent: rent,
            depositRequired:
              depositRequired === "yes",

            depositAmount:
              depositRequired === "yes"
                ? depositAmount
                : null,

            additionalFees,
            utilitiesIncluded,
            internetCharges,

            solarBackupCapacity:
              solarBackupCapacity || null,

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
            propertyType,
            roomType,
            genderPreference,
            description,
            amenities,
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

      alert(
        "Listing created successfully!"
      );

      router.push(
        "/dashboard/landlord/listings"
      );

      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">

        {/* Header */}

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

          <p className="mt-2 text-slate-600">
            Create a listing for students
            looking for accommodation.
          </p>
        </div>

        {/* ================================================== */}
        {/* LISTING GUIDELINES NOTICE */}
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
                Please review MushaLink&apos;s Landlord Listing
                Guidelines to ensure your property meets our
                photo, information, pricing and verification
                requirements.
              </p>

              <a
                href="/MushaLink_Landlord_Listing_Guidelines_Final.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-blue-dark"
              >
                View Landlord Listing Guidelines
                <span className="ml-2">↗</span>
              </a>

            </div>

          </div>

        </div>

        {/* Form */}

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
              Tell students about the
              property.
            </p>

            <div className="mt-6 space-y-5">

              {/* Title */}

              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Property Title
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
                </label>

                <div className="space-y-4">

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-600">
                      House Number & Street
                    </label>

                    <input
                      type="text"
                      value={address}
                      onChange={(e) =>
                        setAddress(
                          e.target.value
                        )
                      }
                      placeholder="e.g. 123 Gukurahundi Avenue"
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-600">
                      Suburb
                    </label>

                    <input
                      type="text"
                      value={suburb}
                      onChange={(e) =>
                        setSuburb(e.target.value)
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

                {/* Rent */}

                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Monthly Rent
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

                {/* Property Type */}

                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Property Type
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

                {/* Room Type */}

                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Room Type
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

              {/* ================================================== */}
              {/* PRICING & COSTS */}
              {/* ================================================== */}

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <h2 className="text-lg font-semibold text-slate-900">
                  Pricing & Costs
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  Be clear and transparent about all costs a student
                  may need to pay.
                </p>

                <div className="mt-6 space-y-6">

                  {/* Security Deposit */}

                  <div>
                    <label className="mb-2 block font-medium text-slate-700">
                      Security Deposit Required?
                    </label>

                    <select
                      value={depositRequired}
                      onChange={(e) => {
                        setDepositRequired(e.target.value);

                        if (e.target.value !== "yes") {
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

                  {/* Deposit Amount */}

                  {depositRequired === "yes" && (
                    <div>
                      <label className="mb-2 block font-medium text-slate-700">
                        Security Deposit Amount
                      </label>

                      <input
                        type="number"
                        value={depositAmount}
                        onChange={(e) =>
                          setDepositAmount(e.target.value)
                        }
                        placeholder="e.g. 250"
                        min="1"
                        required
                        className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                      />

                      <p className="mt-2 text-xs text-slate-500">
                        Enter the amount the student must pay as a
                        security deposit.
                      </p>
                    </div>
                  )}

                  {/* Additional Fees */}

                  <div>
                    <label className="mb-2 block font-medium text-slate-700">
                      Additional Fees
                    </label>

                    <textarea
                      value={additionalFees}
                      onChange={(e) =>
                        setAdditionalFees(e.target.value)
                      }
                      placeholder="e.g. Cleaning fee: $20/month. No other mandatory fees."
                      rows={3}
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                    />

                    <p className="mt-2 text-xs text-slate-500">
                      Include any mandatory fees or charges not covered
                      by the monthly rent.
                    </p>
                  </div>

                  {/* Utilities */}

                  <div>
                    <label className="mb-2 block font-medium text-slate-700">
                      Utilities
                    </label>

                    <textarea
                      value={utilitiesIncluded}
                      onChange={(e) =>
                        setUtilitiesIncluded(e.target.value)
                      }
                      placeholder="e.g. Water and electricity included. Internet and gas excluded."
                      rows={3}
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                    />

                    <p className="mt-2 text-xs text-slate-500">
                      Clearly state which utilities are included in the
                      rent and which the student pays separately.
                    </p>
                  </div>

                  {/* Internet Charges */}

                  <div>
                    <label className="mb-2 block font-medium text-slate-700">
                      Internet Charges
                    </label>

                    <textarea
                      value={internetCharges}
                      onChange={(e) =>
                        setInternetCharges(e.target.value)
                      }
                      placeholder="e.g. Wi-Fi included in rent. No additional internet charge."
                      rows={3}
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                    />

                    <p className="mt-2 text-xs text-slate-500">
                      Explain whether internet is included, separately
                      charged, or unavailable.
                    </p>
                  </div>

                </div>

              </section>

              {/* Gender */}

              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Gender Preference
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
          {/* UTILITIES & SERVICES */}
          {/* ================================================== */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-slate-900">
              Utilities & Services
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Tell students about the internet, water, electricity,
              and backup power available at this property.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              {/* Internet Provider */}

              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Internet Service Provider
                </label>

                <select
                  value={internetProvider}
                  onChange={(e) =>
                    setInternetProvider(e.target.value)
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

              {/* Water Source */}

              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Water Source
                </label>

                <select
                  value={waterSource}
                  onChange={(e) =>
                    setWaterSource(e.target.value)
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
                </label>

                <select
                  value={waterDrinkable}
                  onChange={(e) =>
                    setWaterDrinkable(e.target.value)
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

              {/* Solar Backup */}

              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  ☀️ Solar Backup Capacity
                </label>

                <select
                  value={solarBackupCapacity}
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

            {/* Solar Capacity Guide */}

            {solarBackupCapacity &&
              solarBackupCapacity !== "NONE" && (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">

                  <h3 className="font-semibold text-slate-900">
                    ☀️ Solar Backup Guide
                  </h3>

                  {solarBackupCapacity ===
                    "BASIC_500VA_2KVA" && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-slate-800">
                        Basic Backup — 500VA–2kVA
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        Essential power for everyday needs.
                      </p>

                      <p className="mt-3 text-sm font-medium text-slate-700">
                        Typically supports:
                      </p>

                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
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
                        Standard Backup — 3–4kVA
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        Includes Basic Backup, plus:
                      </p>

                      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
                        <li>Fridge / Freezer</li>
                        <li>Multiple phones & devices</li>
                        <li>Multiple laptops</li>
                        <li>Small household appliances</li>
                      </ul>
                    </div>
                  )}

                  {solarBackupCapacity ===
                    "HIGH_CAPACITY_5_6KVA" && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-slate-800">
                        High-Capacity Backup — 5–6kVA
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        Includes Standard Backup, plus:
                      </p>

                      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
                        <li>Electric Jugs / Kettles</li>
                        <li>Irons</li>
                        <li>Washing Machines</li>
                        <li>Multiple household appliances</li>
                      </ul>
                    </div>
                  )}

                  {solarBackupCapacity ===
                    "PREMIUM_7KVA_PLUS" && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-slate-800">
                        Premium Backup — 7+ kVA
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        Includes High-Capacity Backup, plus:
                      </p>

                      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
                        <li>Higher-power appliances</li>
                        <li>Multiple appliances running together</li>
                        <li>Greater overall power capacity</li>
                      </ul>
                    </div>
                  )}

                  <p className="mt-4 text-xs leading-5 text-slate-500">
                    Actual appliance support may vary depending on
                    the property's solar system, battery capacity,
                    inverter configuration, and simultaneous usage.
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
            </h2>

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

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <Link
              href="/dashboard/landlord/listings"
              className="rounded-xl border border-slate-300 px-6 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={
                loading ||
                loadingUniversities
              }
              className="rounded-xl bg-brand-blue px-6 py-3 font-semibold text-white transition hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading
                ? "Creating Listing..."
                : "Create Listing"}
            </button>

          </div>

        </form>
      </div>
    </main>
  );
}