"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import NavLinks from "./NavLinks";

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
          <div className="fixed right-0 top-0 z-50 flex h-screen w-72 flex-col bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b p-5">
              <h2 className="text-xl font-bold">
                Menu
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X />
              </button>
            </div>

            <div className="flex flex-col gap-2 p-5">
              <NavLinks
                mobile
                onClick={() => setOpen(false)}
              />
            </div>

            <div className="mt-auto border-t p-5 space-y-3">

              <button className="w-full rounded-xl border py-3 font-medium">
                Login
              </button>

              <button className="w-full rounded-xl bg-brand-blue py-3 font-medium text-white">
                Sign Up
              </button>

            </div>

          </div>
        </>
      )}
    </>
  );
}