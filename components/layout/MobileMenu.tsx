"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import NavLinks from "./NavLinks";
import Image from "next/image";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg p-2 hover:bg-slate-100 md:hidden"
      >
        <Menu size={28} />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/40"
          />

          {/* Drawer */}
          <div className="fixed right-0 top-0 z-50 flex h-dvh w-[85%] max-w-sm flex-col bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b px-6 py-4">
                <Image
                    src="/images/MushaLink Logo.png"
                    alt="MushaLink"
                    width={150}
                    height={48}
                    className="h-10 w-auto"
                />

                <button
                    onClick={() => setOpen(false)}
                    className="rounded-lg p-2 transition hover:bg-slate-100"
                >
                    <X size={24} />
                </button>
                </div>

            <div className="flex flex-1 flex-col gap-2 px-5 py-6">
              <NavLinks
                mobile
                onClick={() => setOpen(false)}
              />
            </div>

            <div className="mt-auto border-t p-5 space-y-3">

              <button className="w-full rounded-xl border border-slate-300 py-3 font-medium text-slate-700 transition hover:bg-slate-100">
                Login
              </button>

              <button className="w-full rounded-xl bg-brand-blue py-3 font-medium text-white transition hover:bg-brand-blue-dark">
                Sign Up
              </button>

            </div>

          </div>
        </>
      )}
    </>
  );
}