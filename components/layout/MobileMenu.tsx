"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Menu, X } from "lucide-react";
import NavLinks from "./NavLinks";
import Image from "next/image";
import Link from "next/link";

interface MobileMenuProps {
  isLoggedIn: boolean;
  name: string | null;
  profilePhotoUrl: string | null;
  profileHref: string;
}

export default function MobileMenu({
  isLoggedIn,
  name,
  profilePhotoUrl,
  profileHref,
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

                  {/* Profile */}

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-blue text-sm font-bold text-white">
                        {profilePhotoUrl ? (
                          <img
                            src={profilePhotoUrl}
                            alt={name || "Profile"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          (name || "User")
                            .split(" ")
                            .filter(Boolean)
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">
                          {name || "User"}
                        </p>

                        <p className="text-sm text-slate-500">
                          My Account
                        </p>
                      </div>

                    </div>

                    <div className="mt-4 space-y-2">

                      <Link
                        href={profileHref}
                        onClick={() => setOpen(false)}
                        className="block w-full rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-white"
                      >
                        My Profile
                      </Link>

                      <Link
                        href="/dashboard/settings"
                        onClick={() => setOpen(false)}
                        className="block w-full rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-white"
                      >
                        Account Settings
                      </Link>

                      <button
                        type="button"
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="block w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-white"
                      >
                        Log Out
                      </button>

                    </div>

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