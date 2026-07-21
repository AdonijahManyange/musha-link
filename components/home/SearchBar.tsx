"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 

export default function SearchBar() {
  const router = useRouter();

  const [university, setUniversity] = useState("");
  const [budget, setBudget] = useState("");
  const [roomType, setRoomType] = useState("");
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
            onChange={(e) => setUniversity(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-[#1C3769] focus:outline-none"
          >
            <option>Select University</option>
            <option>University of Zimbabwe</option>
            <option>NUST</option>
            <option>Midlands State University</option>
            <option>Chinhoyi University</option>
            <option>HIT</option>
            <option>Africa University</option>
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
           className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-[#1C3769] focus:outline-none">
            <option>Any Budget</option>
            <option>Under $100</option>
            <option>$100 - $150</option>
            <option>$150 - $200</option>
            <option>$200+</option>
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
            <option>Any</option>
            <option>Private Room</option>
            <option>Shared Room</option>
            <option>Apartment</option>
            <option>House</option>
          </select>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="rounded-xl bg-[#1C3769] px-8 py-4 font-semibold text-white transition hover:bg-[#254B8C]"
          >
            Find Accommodation
          </button>
        </div>
      </div>
    </div>
  );
}