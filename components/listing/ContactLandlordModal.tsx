"use client";

import {
  Phone,
  Mail,
  MessageCircle,
  X,
} from "lucide-react";

type ContactLandlordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  landlord: {
    name: string;
    phone: string;
    email: string;
  };
  listingTitle: string;
};

export default function ContactLandlordModal({
  isOpen,
  onClose,
  landlord,
  listingTitle,
}: ContactLandlordModalProps) {
  if (!isOpen) return null;

  const phone = landlord.phone.replace(/\D/g, "");

  const whatsappMessage = encodeURIComponent(
    `Hi ${landlord.name},

I'm interested in your "${listingTitle}" listed on MushaLink.

Is it still available?`
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
      >
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
            <h2 className="text-3xl font-bold text-slate-900">
                Contact Landlord
            </h2>

            <button
                onClick={onClose}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
                <X size={20} />
            </button>
        </div>
     

        {/* Landlord */}
        <div className="mb-6 flex items-center gap-5">
            <div className="ml-2 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-blue text-2xl font-bold text-white">
                {landlord.name.charAt(0)}
            </div>

            <div>

                <h3 className="text-lg font-bold text-slate-900">
                {landlord.name}
                </h3>

                <p className="text-sm font-medium text-emerald-600">
                  Verified Landlord
                </p>
            </div>
        </div>

        {/* Phone */}
        <a
          href={`tel:${phone}`}
          className="mb-4 flex items-center gap-4 rounded-2xl bg-slate-50 p-5 transition-all hover:-translate-y-0.5 hover:border-brand-blue hover:bg-white hover:shadow-sm"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100">
            <Phone className="text-brand-blue" size={20} />
            </div>

          <div className="flex flex-col">
            <p className="text-sm text-slate-500">
              Phone
            </p>

            <p className="font-semibold text-slate-900">
              {landlord.phone}
            </p>
          </div>
        </a>

        {/* Email */}
        <a
          href={`mailto:${landlord.email}`}
          className="mb-4 flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-brand-blue hover:bg-white"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100">
            <Mail className="text-brand-blue" size={20} />
          </div>

          <div className="flex flex-col">
            <p className="text-sm text-slate-500">
              Email
            </p>

            <p className="font-semibold text-slate-900 break-all">
              {landlord.email}
            </p>
          </div>
        </a>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${phone}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-green-600 py-4 font-semibold text-white transition bg-[#25D366] hover:bg-[#20BD5A]"
        >
          <MessageCircle size={20} />
          Chat on WhatsApp
        </a>

        {/* Close */}
        <button
          onClick={onClose}
          className="mt-4 w-full rounded-xl border border-slate-300 py-4 font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Close
        </button>
      </div>
    </div>
  );
}