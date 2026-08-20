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
  city: string;
  province: string;
  country: string;
  monthlyRent: number;
  roomType: string;
  genderPreference: string;
  universityId: string;
  distanceToUniversityKm: number | null;
  description: string;
  latitude: number | null;
  longitude: number | null;
  university: University;
};

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
    city: "",
    province: "",
    country: "",
    monthlyRent: "",
    roomType: "",
    genderPreference: "",
    universityId: "",
    distanceToUniversityKm: "",
    description: "",
    latitude: "",
    longitude: "",
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

        const loadedListing = data.listing;

        setListing(loadedListing);

        setFormData({
          title: loadedListing.title || "",
          propertyType:
            loadedListing.propertyType || "",
          address: loadedListing.address || "",
          city: loadedListing.city || "",
          province:
            loadedListing.province || "",
          country:
            loadedListing.country || "",
          monthlyRent:
            loadedListing.monthlyRent?.toString() ||
            "",
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
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            propertyType:
              formData.propertyType,
            address: formData.address,
            city: formData.city,
            province: formData.province,
            country: formData.country,
            monthlyRent: Number(
              formData.monthlyRent
            ),
            roomType: formData.roomType,
            genderPreference:
              formData.genderPreference,
            universityId:
              formData.universityId,
            description:
              formData.description,
          }),
        }
      );

      const data = await response.json();

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

        {/* Back */}

        <Link
          href="/dashboard/landlord/listings"
          className="text-sm font-medium text-slate-600 transition hover:text-brand-blue"
        >
          ← Back to My Listings
        </Link>

        {/* Header */}

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

        {/* Error */}

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
                  value={formData.title}
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
                  value={formData.address}
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

              {/* City / Province */}

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    City
                  </label>

                  <input
                    type="text"
                    value={formData.city}
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
                  value={formData.country}
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

              {/* Distance — DISABLED */}

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
              value={formData.description}
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

              {/* Latitude — DISABLED */}

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

              {/* Longitude — DISABLED */}

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