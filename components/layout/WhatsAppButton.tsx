"use client";

import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "4697458913";

const MESSAGE =
  "Hi MushaLink! I would like to know more about your student accommodation platform.";

export default function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    MESSAGE
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with MushaLink on WhatsApp"
      title="Chat with MushaLink"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-[#20BA5A] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-200"
    >
      <svg
        viewBox="0 0 32 32"
        fill="currentColor"
        className="h-8 w-8"
        aria-hidden="true"
      >
        <path d="M16 .5C7.44.5.5 7.44.5 16c0 2.73.72 5.41 2.08 7.77L.5 31.5l7.94-2.08A15.42 15.42 0 0 0 16 31.5c8.56 0 15.5-6.94 15.5-15.5S24.56.5 16 .5Zm0 28.2c-2.37 0-4.7-.64-6.72-1.86l-.48-.28-4.72 1.24 1.26-4.6-.31-.49A12.66 12.66 0 1 1 16 28.7Zm6.95-9.48c-.38-.19-2.24-1.1-2.59-1.22-.35-.13-.6-.19-.86.19-.25.38-.98 1.22-1.2 1.47-.22.26-.44.29-.82.1-.38-.19-1.6-.59-3.05-1.88-1.13-1.01-1.89-2.25-2.11-2.63-.22-.38-.02-.59.17-.78.17-.17.38-.44.57-.66.19-.22.25-.38.38-.64.13-.25.07-.47-.03-.66-.09-.19-.86-2.07-1.18-2.83-.31-.74-.63-.64-.86-.65h-.73c-.25 0-.66.1-1.01.47-.35.38-1.33 1.3-1.33 3.17s1.36 3.68 1.55 3.93c.19.25 2.68 4.09 6.5 5.74.91.39 1.62.63 2.17.8.91.29 1.74.25 2.39.15.73-.11 2.24-.92 2.55-1.81.32-.89.32-1.65.22-1.81-.09-.16-.35-.25-.73-.44Z" />
      </svg>

      <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
        Chat with MushaLink
      </span>
    </a>
  );
}