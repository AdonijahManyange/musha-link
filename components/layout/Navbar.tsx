"use client";

import Link from "next/link";
import Image from "next/image";
import MobileMenu from "./MobileMenu";
import NavLinks from "./NavLinks";

export default function Navbar() {

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <nav className="mx-auto flex w-full items-center justify-between px-4 py-3 md:h-28">

        {/* Logo */}
        <div>
          <Link href="/#top">
            <Image
            src="/images/MushaLink Logo.png"
            alt="MushaLink"
            width={220}
            height={70}
            className="h-10 w-auto md:h-14"
          />
          </Link>
        </div>

        {/* Navigation */}
        <div className="hidden items-center gap-8 font-medium text-slate-700 md:flex">
          <NavLinks />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button className="hidden rounded-lg px-4 py-2 text-slate-700 hover:bg-slate-100 md:block">
            Login
          </button>

          <button className="hidden rounded-lg bg-brand-blue px-5 py-2 text-white hover:bg-brand-blue-dark md:block">
            Sign Up
          </button>

          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}