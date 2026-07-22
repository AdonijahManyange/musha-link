import Image from "next/image";
import SearchBar from "./SearchBar";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[700px] overflow-hidden"
    >

      
      {/* Background Image */}
      <Image
        src="/images/new hero bg.png"
        alt="Students moving into accommodation"
        fill
        priority
        className="object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-blue-950/65 to-slate-900/40" />

      {/* Content */}
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
          Verified student accommodation near Zimbabwe's leading universities.
        </p>

        <SearchBar />
      </div>
    </section>
  );
}