"use client";

import { useState } from "react";
import ContactLandlordModal from "./ContactLandlordModal";

type ListingActionsProps = {
  landlord: {
    name: string;
    phone: string;
    email: string;
  };
  listingTitle: string;
};

export default function ListingActions({
  landlord,
  listingTitle,
}: ListingActionsProps) {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      <div className="mt-8 space-y-4">
        <button
          type="button"
          onClick={() => setIsContactOpen(true)}
          className="w-full rounded-xl bg-brand-blue py-4 text-lg font-semibold text-white transition hover:bg-brand-blue-dark"
        >
          Contact Landlord
        </button>

        <button
          type="button"
          className="w-full rounded-xl border border-slate-300 py-4 text-lg font-semibold text-brand-blue transition hover:bg-slate-100"
        >
          Schedule Viewing
        </button>
      </div>

      <ContactLandlordModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        landlord={landlord}
        listingTitle={listingTitle}
      />
    </>
  );
}