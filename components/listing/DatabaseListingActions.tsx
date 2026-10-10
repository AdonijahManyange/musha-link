"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";

import ScheduleViewingModal from "@/components/listing/ScheduleViewingModal";

type DatabaseListingActionsProps = {
  listingId: string;
  listingTitle: string;
  landlord: {
    name: string;
    phone: string;
    email: string;
  };
};

export default function DatabaseListingActions({
  listingId,
  listingTitle,
  landlord,
}: DatabaseListingActionsProps) {
  const [isViewingOpen, setIsViewingOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsViewingOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        <CalendarDays size={17} />
        Request Viewing
      </button>

      <ScheduleViewingModal
        isOpen={isViewingOpen}
        onClose={() => setIsViewingOpen(false)}
        landlord={landlord}
        listingId={listingId}
        listingTitle={listingTitle}
      />
    </>
  );
}
