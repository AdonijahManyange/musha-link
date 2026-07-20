import SearchBar from "./SearchBar";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-50">
      {/* Hero Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-700/70" />

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1600')",
        }}
      />

      <div className="relative mx-auto flex min-h-[700px] max-w-7xl flex-col items-center justify-center px-6 text-center text-white">

        <span className="mb-6 rounded-full bg-white/20 px-5 py-2 text-sm font-medium backdrop-blur">
          🇿🇼 Zimbabwe's Student Housing Platform
        </span>

        <h1 className="max-w-4xl text-6xl font-bold leading-tight">
          Find Your Home
          <br />
          Away From Home
        </h1>

        <p className="mt-8 max-w-2xl text-xl text-slate-200">
          Verified student accommodation near Zimbabwe's leading
          universities.
        </p>

        <SearchBar />
      </div>
    </section>
  );
}