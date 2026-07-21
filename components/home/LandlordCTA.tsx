import Image from "next/image";

export default function LandlordCTA() {
  return (
    <section className="bg-gradient-to-r from-[#1C3769] via-[#23427D] to-[#2A4D8F] py-24">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 lg:flex-row">

        {/* Left Side */}

        <div className="flex-1 text-white">

          <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
            🏠 For Landlords
          </span>

          <h2 className="mt-6 text-5xl font-bold leading-tight">
            Fill Your Rooms Faster.
          </h2>

          <p className="mt-6 max-w-xl text-lg text-blue-100">
            Reach thousands of university students across Zimbabwe
            looking for safe, verified accommodation.
          </p>

          <div className="mt-10 space-y-4 text-lg">

            <div>✅ Free landlord account</div>

            <div>✅ Upload listings in minutes</div>

            <div>✅ Receive enquiries directly</div>

            <div>✅ Manage everything from one dashboard</div>

          </div>

          <button className="mt-10 rounded-xl bg-white px-8 py-4 text-lg font-bold text-blue-900 transition hover:scale-105">
            List Your Property
          </button>

        </div>

        {/* Right Side */}

        <div className="flex-1">

        <Image
            src="/images/landlord-cta.png"
            alt="Landlord showing accommodation to students"
            width={700}
            height={500}
            className="rounded-3xl object-cover shadow-2xl"
        />

        </div>

      </div>
    </section>
  );
}