import Hero from "@/components/home/Hero";
import TrustSection from "@/components/home/TrustSection";
import FeaturedListings from "@/components/home/FeaturedListings";
import LandlordCTA from "@/components/home/LandlordCTA";
import Universities from "@/components/home/Universities";
import StudentAccommodation from "@/components/home/StudentAccommodation";
import EnableNotifications from "@/components/EnableNotifications";

export default function Home() {
  return (
    <>
      <Hero />

      {/* Temporary notification test */}
      <div className="flex justify-center bg-slate-50 px-4 py-4">
        <EnableNotifications />
      </div>

      <TrustSection />
      <FeaturedListings />
      <LandlordCTA />
      <Universities />
      <StudentAccommodation />
    </>
  );
}