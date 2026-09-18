"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type University = {
  id: string;
  name: string;
  city: string;
};

const BUDGET_OPTIONS = [
  { value: "", label: "Any Price" },
  { value: "under-100", label: "Under US$100" },
  { value: "100-150", label: "US$100–150" },
  { value: "150-200", label: "US$150–200" },
  { value: "200+", label: "US$200+" },
];

const ROOM_TYPES = [
  { value: "", label: "Any Room" },
  { value: "PRIVATE", label: "Private Room" },
  { value: "SHARED", label: "Shared Room" },
  { value: "ENTIRE_PROPERTY", label: "Entire Property" },
];

const GENDER_OPTIONS = [
  { value: "", label: "Any Gender" },
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
];

const DISTANCE_OPTIONS = [
  { value: "", label: "Any Distance" },
  { value: "1", label: "Within 1 km" },
  { value: "3", label: "Within 3 km" },
  { value: "5", label: "Within 5 km" },
  { value: "10", label: "Within 10 km" },
];

export default function BrowseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [university, setUniversity] = useState("");
  const [budget, setBudget] = useState("");
  const [roomType, setRoomType] = useState("");
  const [gender, setGender] = useState("");
  const [distance, setDistance] = useState("");

  const [universities, setUniversities] = useState<
    University[]
  >([]);

  // ----------------------------------------------------------
  // Load universities
  // ----------------------------------------------------------

  useEffect(() => {
    async function loadUniversities() {
      try {
        const response = await fetch(
          "/api/universities",
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (response.ok) {
          setUniversities(data);
        }
      } catch (error) {
        console.error(
          "Failed to load universities:",
          error
        );
      }
    }

    loadUniversities();
  }, []);

  // ----------------------------------------------------------
  // Read filters from URL
  // ----------------------------------------------------------

  useEffect(() => {
    setSearch(
      searchParams.get("search") || ""
    );

    setUniversity(
      searchParams.get("university") || ""
    );

    setBudget(
      searchParams.get("budget") || ""
    );

    setRoomType(
      searchParams.get("roomType") || ""
    );

    setGender(
      searchParams.get("gender") || ""
    );

    setDistance(
      searchParams.get("distance") || ""
    );
  }, [searchParams]);

  // ----------------------------------------------------------
  // Apply filters
  // ----------------------------------------------------------

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (search.trim()) {
      params.set(
        "search",
        search.trim()
      );
    }

    if (university) {
      params.set(
        "university",
        university
      );
    }

    if (budget) {
      params.set("budget", budget);
    }

    if (roomType) {
      params.set(
        "roomType",
        roomType
      );
    }

    if (gender) {
      params.set(
        "gender",
        gender
      );
    }

    if (distance) {
      params.set(
        "distance",
        distance
      );
    }

    const query = params.toString();

    router.push(
      query
        ? `/browse?${query}`
        : "/browse"
    );
  };

  // ----------------------------------------------------------
  // Clear filters
  // ----------------------------------------------------------

  const clearFilters = () => {
    setSearch("");
    setUniversity("");
    setBudget("");
    setRoomType("");
    setGender("");
    setDistance("");

    router.push("/browse");
  };

  const hasFilters =
    search ||
    university ||
    budget ||
    roomType ||
    gender ||
    distance;

  return (
    <section className="w-full rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

      {/* Search */}

      <div className="flex min-w-0 w-full flex-col gap-3 lg:flex-row">

        <div className="flex-1">
          <label className="sr-only">
            Search accommodation
          </label>

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                applyFilters();
              }
            }}
            placeholder="Search by city, suburb or university..."
            className="w-full min-w-0 rounded-2xl border border-slate-300 bg-slate-50 px-5 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/10"
          />
        </div>

        <button
          type="button"
          onClick={applyFilters}
          className="rounded-2xl bg-brand-blue px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-blue-dark"
        >
          Search
        </button>

      </div>

      {/* Filter Controls */}

      <div className="mt-4 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">

        {/* University */}

        <select
          value={university}
          onChange={(e) =>
            setUniversity(e.target.value)
          }
          className="w-full min-w-0 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-blue"
        >
          <option value="">
            University
          </option>

          {universities.map((uni) => (
            <option
              key={uni.id}
              value={uni.id}
            >
              {uni.name}
            </option>
          ))}
        </select>

        {/* Price */}

        <select
          value={budget}
          onChange={(e) =>
            setBudget(e.target.value)
          }
          className="w-full min-w-0 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-blue"
        >
          {BUDGET_OPTIONS.map(
            (option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            )
          )}
        </select>

        {/* Room Type */}

        <select
          value={roomType}
          onChange={(e) =>
            setRoomType(e.target.value)
          }
          className="w-full min-w-0 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-blue"
        >
          {ROOM_TYPES.map(
            (option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            )
          )}
        </select>

        {/* Gender */}

        <select
          value={gender}
          onChange={(e) =>
            setGender(e.target.value)
          }
          className="w-full min-w-0 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-blue"
        >
          {GENDER_OPTIONS.map(
            (option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            )
          )}
        </select>

        {/* Distance */}

        <select
          value={distance}
          onChange={(e) =>
            setDistance(e.target.value)
          }
          className="w-full min-w-0 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-blue"
        >
          {DISTANCE_OPTIONS.map(
            (option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            )
          )}
        </select>

      </div>

      {/* Bottom Row */}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

        <p className="text-sm text-slate-500">
          Filter accommodation by your preferences.
        </p>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-semibold text-slate-600 transition hover:text-brand-blue"
          >
            Clear all
          </button>
        )}

      </div>

    </section>
  );
}