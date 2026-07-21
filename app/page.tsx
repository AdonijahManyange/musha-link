import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import TrustSection from "@/components/home/TrustSection";
import FeaturedListings from "@/components/home/FeaturedListings";
import LandlordCTA from "@/components/home/LandlordCTA";
import Universities from "@/components/home/Universities";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <TrustSection />
      <FeaturedListings />
      <LandlordCTA />
      <Universities />
    </>
  );
}