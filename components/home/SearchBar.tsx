export default function SearchBar() {
  return (
    <div className="mx-auto mt-12 max-w-5xl rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
      <div className="grid gap-4 md:grid-cols-4">
        {/* University */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            University
          </label>

          <select className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none">
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

          <select className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none">
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

          <select className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none">
            <option>Any</option>
            <option>Private Room</option>
            <option>Shared Room</option>
            <option>Apartment</option>
            <option>House</option>
          </select>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700">
            Find Accommodation
          </button>
        </div>
      </div>
    </div>
  );
}