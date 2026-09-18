import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import LandlordCTAButton from "./LandlordCTAButton";

export default async function LandlordCTA() {
  const user = await getCurrentUser();

  const isSignedIn = !!user;
  const isLandlord = user?.role === "LANDLORD";

  return (
    <section className="bg-gradient-to-r from-[#1C3769] via-[#23427D] to-[#2A4D8F] py-16 md:py-24">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 md:gap-12 lg:flex-row">

        {/* Left Side */}

        <div className="flex-1 text-white">

          <span className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold md:px-4 md:py-2 md:text-sm">
            🏠 For Landlords
          </span>

          <h2 className="mt-5 text-4xl font-bold leading-tight md:mt-6 md:text-5xl">
            Fill Your Rooms Faster.
          </h2>

          <p className="mt-4 max-w-xl text-base text-blue-100 md:mt-6 md:text-lg">
            Reach thousands of university students across Zimbabwe
            looking for safe, verified accommodation.
          </p>

          <div className="mt-7 space-y-3 text-base md:mt-10 md:space-y-4 md:text-lg">

            <div>✅ Free landlord account</div>

            <div>✅ Upload listings in minutes</div>

            <div>✅ Receive enquiries directly</div>

            <div>✅ Manage everything from one dashboard</div>

          </div>

          <LandlordCTAButton
            isLandlord={isLandlord}
            isSignedIn={isSignedIn}
          />

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