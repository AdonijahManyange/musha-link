"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import NavLinks from "./NavLinks";
import Image from "next/image";
import Link from "next/link";
import LogoutButton from "@/components/auth/LogoutButton";

interface MobileMenuProps {
  isLoggedIn: boolean;
}

export default function MobileMenu({
  isLoggedIn,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button */}

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="rounded-lg p-2 text-slate-900 transition hover:bg-slate-100 md:hidden"
      >
        <Menu
          size={28}
          strokeWidth={2.5}
          className="text-brand-blue"
        />
      </button>

      {open && (
        <>
          {/* Backdrop */}

          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/40"
          />

          {/* Drawer */}

          <div className="fixed inset-y-0 right-0 z-50 flex w-[85%] max-w-sm flex-col bg-white shadow-2xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <Image
                src="/images/MushaLink Logo.png"
                alt="MushaLink"
                width={150}
                height={48}
                className="h-10 w-auto"
              />

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-2 transition hover:bg-slate-100"
              >
                <X
                  size={28}
                  strokeWidth={2.5}
                  className="text-slate-900"
                />
              </button>
            </div>

            {/* Navigation */}

            <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-5 py-6">
              <NavLinks
                mobile
                onClick={() => setOpen(false)}
              />
            </div>

            {/* Authentication */}

            <div className="space-y-3 border-t border-slate-200 p-5">

              {!isLoggedIn ? (
                <>
                  {/* Login */}

                  <Link
                    href="/auth/login"
                    onClick={() => setOpen(false)}
                    className="block w-full rounded-xl border border-slate-300 py-3 text-center font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Login
                  </Link>

                  {/* Sign Up */}

                  <Link
                    href="/auth/signup"
                    onClick={() => setOpen(false)}
                    className="block w-full rounded-xl bg-brand-blue py-3 text-center font-medium text-white transition hover:bg-brand-blue-dark"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  {/* Dashboard */}

                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="block w-full rounded-xl bg-brand-blue py-3 text-center font-medium text-white transition hover:bg-brand-blue-dark"
                  >
                    Dashboard
                  </Link>

                  {/* Logout */}

                  <div className="w-full">
                    <LogoutButton />
                  </div>
                </>
              )}

            </div>
          </div>
        </>
      )}
    </>
  );
}