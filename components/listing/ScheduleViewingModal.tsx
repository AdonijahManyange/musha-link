"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Phone,
  MessageSquare,
  X,
} from "lucide-react";

type ScheduleViewingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  landlord: {
    name: string;
    phone: string;
  };
  listingTitle: string;
};

export default function ScheduleViewingModal({
  isOpen,
  onClose,
  landlord,
  listingTitle,
}: ScheduleViewingModalProps) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");

  if (!isOpen) return null;

  const phone = landlord.phone.replace(/\D/g, "");

  function handleSubmit() {
    if (!name || !phoneNumber || !date || !time) {
      alert("Please complete all required fields.");
      return;
    }

    const message = encodeURIComponent(
`Hi ${landlord.name},

I'd like to schedule a viewing for your listing.

🏠 Property
${listingTitle}

👤 Name
${name}

📞 Phone
${phoneNumber}

📅 Preferred Date
${date}

🕒 Preferred Time
${time}

📝 Additional Note
${note || "None"}

Thank you!`
    );

    window.open(
      `https://wa.me/${phone}?text=${message}`,
      "_blank"
    );

    setName("");
    setPhoneNumber("");
    setDate("");
    setTime("");
    setNote("");

    onClose();
  }

  return (
    <div
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
        <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl mt-24"
        >
        {/* Header */}
        <div className="shrink-0 border-b border-slate-200 p-8">
            <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-slate-900">
                Schedule Viewing
            </h2>

            <button
                onClick={onClose}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
                <X size={22} />
            </button>
            </div>

            <p className="mt-4 text-slate-600">
            Complete the form below and prepare your visit.
            </p>

            {/* Property Summary */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Property
                </p>

                <p className="mt-1 text-lg font-semibold text-slate-900">
                {listingTitle}
                </p>
            </div>

            <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Landlord
                </p>

                <p className="mt-1 text-lg font-semibold text-slate-900">
                {landlord.name}
                </p>
            </div>
            </div>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-8">
            <div className="space-y-6">

            {/* Name */}
            <div>
                <label className="mb-2 flex items-center gap-2 font-medium text-slate-700">
                <User size={18} />
                Your Name
                </label>

                <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-3 text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                />
            </div>

            {/* Phone */}
            <div>
                <label className="mb-2 flex items-center gap-2 font-medium text-slate-700">
                <Phone size={18} />
                Phone Number
                </label>

                <input
                type="tel"
                placeholder="+263 77 123 4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-3 text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                />
            </div>

            {/* Date & Time */}
            <div className="grid gap-5 md:grid-cols-2">

                <div>
                <label className="mb-2 flex items-center gap-2 font-medium text-slate-700">
                    <Calendar size={18} />
                    Preferred Date
                </label>

                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                />
                </div>

                <div>
                <label className="mb-2 flex items-center gap-2 font-medium text-slate-700">
                    <Clock size={18} />
                    Preferred Time
                </label>

                <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                />
                </div>

            </div>

            {/* Notes */}
            <div>
                <label className="mb-2 flex items-center gap-2 font-medium text-slate-700">
                <MessageSquare size={18} />
                Additional Note
                </label>

                <textarea
                rows={5}
                placeholder="Anything you'd like the landlord to know..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-3 text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                />
            </div>

            </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-200 p-8">
            <button
            onClick={handleSubmit}
            className="w-full rounded-xl bg-brand-blue py-4 text-lg font-semibold text-white transition hover:bg-brand-blue-dark"
            >
            Request Viewing
            </button>
        </div>
        </div>
    </div>
); }