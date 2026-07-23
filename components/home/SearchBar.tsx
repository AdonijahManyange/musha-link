"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { getUniversities, getRoomTypes, getBudgetRanges } from "@/lib/filters";
import { useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [university, setUniversity] = useState("");
  const [budget, setBudget] = useState("");
  const [roomType, setRoomType] = useState("");

  useEffect(() => {
    setUniversity(searchParams.get("university") || "");
    setBudget(searchParams.get("budget") || "");
    setRoomType(searchParams.get("roomType") || "");
  }, [searchParams]);

  const universities = getUniversities();
  const roomTypes = getRoomTypes(university);
  const budgetRanges = getBudgetRanges(university);
  const handleSearch = () => {

  if (!university) {
    alert("Please select a university.");
    return;
  }
  const params = new URLSearchParams();
  params.set("university", university);
  if (budget) {
    params.set("budget", budget);
  }

  if (roomType) {
    params.set("roomType", roomType);
  }

  router.push(`/browse?${params.toString()}`);
};

  return (
    <div className="mx-auto mt-12 max-w-5xl rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
      <div className="grid gap-4 md:grid-cols-4">

        {/* University */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            University
          </label>

          <select 
            value={university}
            onChange={(e) => {
              setUniversity(e.target.value);
              setRoomType("");
            }}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-[#1C3769] focus:outline-none"
          >
            <option value="">Select University</option>

            {universities.map((uni) => (
              <option key={uni} value={uni}>
                {uni}
              </option>
            ))}
          </select>
        </div>

        {/* Budget */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Monthly Budget
          </label>

          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-[#1C3769] focus:outline-none"
          >
            {budgetRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Room Type */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Room Type
          </label>

          <select 
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-[#1C3769] focus:outline-none">
            <option value="">Any</option>

            {roomTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <Button
          onClick={handleSearch}
          className="px-8 py-4"
        >
          Find Accommodation
        </Button>
        </div>
      </div>
    </div>
  );
}