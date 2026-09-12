"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

type ProfileMenuProps = {
  name: string | null;
  profilePhotoUrl: string | null;
  profileHref: string;
};

export default function ProfileMenu({
  name,
  profilePhotoUrl,
  profileHref,
}: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const initials =
    (name || "User")
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      {/* Profile Button */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-brand-blue text-sm font-bold text-white ring-2 ring-transparent transition hover:ring-brand-blue/20 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
        aria-label="Open profile menu"
        aria-expanded={isOpen}
      >
        {profilePhotoUrl ? (
          <img
            src={profilePhotoUrl}
            alt={name || "Profile"}
            className="h-full w-full object-cover"
          />
        ) : (
          initials
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-lg">

          <Link
            href={profileHref}
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            My Profile
          </Link>

          <Link
            href="/dashboard/settings"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Account Settings
          </Link>

          <div className="my-1 border-t border-slate-100" />

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="block w-full px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Log Out
          </button>

        </div>
      )}
    </div>
  );
}