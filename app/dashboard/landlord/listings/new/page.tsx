"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type University = {
  id: string;
  name: string;
  city: string;
};

export default function NewListingPage() {
  const router = useRouter();

  const [propertyTitle, setPropertyTitle] =
    useState("");

  const [address, setAddress] =
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

  const [propertyType, setPropertyType] =
    useState("");

  const [roomType, setRoomType] =
    useState("");

  const [genderPreference, setGenderPreference] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [universities, setUniversities] =
    useState<University[]>([]);

  const [loadingUniversities, setLoadingUniversities] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

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
            city,
            province,
            country,
            universityId,
            monthlyRent: rent,
            propertyType,
            roomType,
            genderPreference,
            description,
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

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* Property Information */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-slate-900">
              Property Information
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Tell students about the
              property.
            </p>

            <div className="mt-6 space-y-5">

              {/* Property Title */}

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

              {/* Property Address */}

              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Property Address
                </label>

                <div className="space-y-4">

                  {/* House Number & Street */}

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

                  {/* City + Province */}

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

                  {/* Country */}

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

                <p className="mt-3 text-xs text-slate-500">
                  We'll use this address to
                  automatically calculate the
                  distance from the selected
                  university.
                </p>
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

                {/* Monthly Rent */}

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

              {/* Gender Preference */}

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

              {/* Description */}

              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Description
                </label>

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

            </div>
          </section>

          {/* Actions */}

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