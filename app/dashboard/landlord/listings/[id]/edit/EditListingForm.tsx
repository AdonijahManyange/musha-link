"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type University = {
  id: string;
  name: string;
  city: string;
};

type Listing = {
  id: string;
  title: string;
  address: string;
  city: string;
  province: string;
  country: string;
  monthlyRent: number;
  propertyType: string;
  roomType: string;
  genderPreference: string;
  description: string;
  universityId: string;
  distanceToUniversityKm:
    | number
    | null;
  latitude: number | null;
  longitude: number | null;
  status:
    | "DRAFT"
    | "PUBLISHED"
    | "ARCHIVED";
};

type Props = {
  listing: Listing;
  universities: University[];
};

export default function EditListingForm({
  listing,
  universities,
}: Props) {
  const router = useRouter();

  const [title, setTitle] =
    useState(listing.title);

  const [address, setAddress] =
    useState(listing.address);

  const [city, setCity] =
    useState(listing.city);

  const [province, setProvince] =
    useState(listing.province);

  const [country, setCountry] =
    useState(listing.country);

  const [monthlyRent, setMonthlyRent] =
    useState(
      String(listing.monthlyRent)
    );

  const [propertyType, setPropertyType] =
    useState(listing.propertyType);

  const [roomType, setRoomType] =
    useState(listing.roomType);

  const [
    genderPreference,
    setGenderPreference,
  ] = useState(
    listing.genderPreference
  );

  const [
    description,
    setDescription,
  ] = useState(
    listing.description
  );

  const [
    universityId,
    setUniversityId,
  ] = useState(
    listing.universityId
  );

  const [
    distanceToUniversityKm,
    setDistanceToUniversityKm,
  ] = useState(
    listing.distanceToUniversityKm !==
      null
      ? String(
          listing.distanceToUniversityKm
        )
      : ""
  );

  const [latitude, setLatitude] =
    useState(
      listing.latitude !== null
        ? String(listing.latitude)
        : ""
    );

  const [longitude, setLongitude] =
    useState(
      listing.longitude !== null
        ? String(listing.longitude)
        : ""
    );

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

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
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            title,
            address,
            city,
            province,
            country,
            monthlyRent:
              Number(monthlyRent),
            propertyType,
            roomType,
            genderPreference,
            description,
            universityId,
            distanceToUniversityKm:
              distanceToUniversityKm ===
              ""
                ? null
                : Number(
                    distanceToUniversityKm
                  ),
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

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to update listing."
        );
      }

      setSuccess(
        "Listing updated successfully."
      );

      // Give the user a moment to see
      // the success message.
      setTimeout(() => {
        router.push(
          "/dashboard/landlord/listings"
        );

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

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Success */}

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {/* Basic Information */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

        <h2 className="text-lg font-semibold text-slate-900">
          Property Information
        </h2>

        <div className="mt-6 space-y-5">

          {/* Title */}

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-700"
            >
              Property Title
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
              required
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            />
          </div>

          {/* Property Type */}

          <div>
            <label
              htmlFor="propertyType"
              className="block text-sm font-medium text-slate-700"
            >
              Property Type
            </label>

            <select
              id="propertyType"
              value={propertyType}
              onChange={(event) =>
                setPropertyType(
                  event.target.value
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
            <label
              htmlFor="address"
              className="block text-sm font-medium text-slate-700"
            >
              Address
            </label>

            <input
              id="address"
              type="text"
              value={address}
              onChange={(event) =>
                setAddress(
                  event.target.value
                )
              }
              required
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            />
          </div>

          {/* Location */}

          <div className="grid gap-5 sm:grid-cols-2">

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-slate-700"
              >
                City
              </label>

              <input
                id="city"
                type="text"
                value={city}
                onChange={(event) =>
                  setCity(
                    event.target.value
                  )
                }
                required
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

            <div>
              <label
                htmlFor="province"
                className="block text-sm font-medium text-slate-700"
              >
                Province
              </label>

              <input
                id="province"
                type="text"
                value={province}
                onChange={(event) =>
                  setProvince(
                    event.target.value
                  )
                }
                required
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

          </div>

          {/* Country */}

          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-slate-700"
            >
              Country
            </label>

            <input
              id="country"
              type="text"
              value={country}
              onChange={(event) =>
                setCountry(
                  event.target.value
                )
              }
              required
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            />
          </div>

        </div>

      </section>

      {/* Rental Information */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

        <h2 className="text-lg font-semibold text-slate-900">
          Rental Information
        </h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">

          {/* Rent */}

          <div>
            <label
              htmlFor="monthlyRent"
              className="block text-sm font-medium text-slate-700"
            >
              Monthly Rent
            </label>

            <input
              id="monthlyRent"
              type="number"
              min="1"
              step="0.01"
              value={monthlyRent}
              onChange={(event) =>
                setMonthlyRent(
                  event.target.value
                )
              }
              required
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            />
          </div>

          {/* Room Type */}

          <div>
            <label
              htmlFor="roomType"
              className="block text-sm font-medium text-slate-700"
            >
              Room Type
            </label>

            <select
              id="roomType"
              value={roomType}
              onChange={(event) =>
                setRoomType(
                  event.target.value
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

          {/* Gender */}

          <div>
            <label
              htmlFor="genderPreference"
              className="block text-sm font-medium text-slate-700"
            >
              Gender Preference
            </label>

            <select
              id="genderPreference"
              value={genderPreference}
              onChange={(event) =>
                setGenderPreference(
                  event.target.value
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

        </div>

      </section>

      {/* University */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

        <h2 className="text-lg font-semibold text-slate-900">
          University
        </h2>

        <div className="mt-6 space-y-5">

          <div>
            <label
              htmlFor="universityId"
              className="block text-sm font-medium text-slate-700"
            >
              University
            </label>

            <select
              id="universityId"
              value={universityId}
              onChange={(event) =>
                setUniversityId(
                  event.target.value
                )
              }
              required
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            >
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

          <div>
            <label
              htmlFor="distanceToUniversityKm"
              className="block text-sm font-medium text-slate-700"
            >
              Distance to University (km)
            </label>

            <input
              id="distanceToUniversityKm"
              type="number"
              min="0"
              step="0.1"
              value={
                distanceToUniversityKm
              }
              onChange={(event) =>
                setDistanceToUniversityKm(
                  event.target.value
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            />
          </div>

        </div>

      </section>

      {/* Description */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

        <h2 className="text-lg font-semibold text-slate-900">
          Description
        </h2>

        <div className="mt-6">

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            rows={7}
            required
            className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            placeholder="Describe the property, rooms, location, and anything students should know..."
          />

        </div>

      </section>

      {/* Coordinates */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

        <h2 className="text-lg font-semibold text-slate-900">
          Location Coordinates
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Optional. These can be used later
          for displaying the property on a map.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">

          <div>
            <label
              htmlFor="latitude"
              className="block text-sm font-medium text-slate-700"
            >
              Latitude
            </label>

            <input
              id="latitude"
              type="number"
              step="any"
              value={latitude}
              onChange={(event) =>
                setLatitude(
                  event.target.value
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            />
          </div>

          <div>
            <label
              htmlFor="longitude"
              className="block text-sm font-medium text-slate-700"
            >
              Longitude
            </label>

            <input
              id="longitude"
              type="number"
              step="any"
              value={longitude}
              onChange={(event) =>
                setLongitude(
                  event.target.value
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
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