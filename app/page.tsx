import Hero from "@/components/home/Hero";
import TrustSection from "@/components/home/TrustSection";
import FeaturedListings from "@/components/home/FeaturedListings";
import LandlordCTA from "@/components/home/LandlordCTA";
import Universities from "@/components/home/Universities";
import StudentAccommodation from "@/components/home/StudentAccommodation";
import EnableNotifications from "@/components/EnableNotifications";
import PublicSiteLayout from "@/components/layout/PublicSiteLayout";
import Partners from "@/components/home/Partners";
import LimitedTimePromotion from "@/components/LimitedTimePromotion";

export default function Home() {
  return (
  <PublicSiteLayout>
    <>
      <Hero />
      <LimitedTimePromotion />

      {/* Browser notification opt-in */}
      <div className="bg-slate-50 px-4 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm sm:flex-row sm:text-left">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Stay up to date
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Enable browser notifications for new messages and viewing request updates.
            </p>
          </div>
          <EnableNotifications />
        </div>
      </div>

      <TrustSection />
      <FeaturedListings />
      <LandlordCTA />
      <Universities />
      <StudentAccommodation />
      <Partners />
    </>
  </PublicSiteLayout>
);
}
