import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import MobileMenu from "./MobileMenu";
import NavLinks from "./NavLinks";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function Navbar() {
  const user = await getCurrentUser();
  const isLoggedIn = !!user;

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

        {/* Desktop Buttons */}
        <div className="flex items-center gap-3">

          {!isLoggedIn ? (
            <>
              <Link
                href="/auth/login"
                className="hidden rounded-lg px-4 py-2 text-slate-700 transition hover:bg-slate-100 md:block"
              >
                Login
              </Link>

              <Link
                href="/auth/signup"
                className="hidden rounded-lg bg-brand-blue px-5 py-2 text-white transition hover:bg-brand-blue-dark md:block"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="hidden rounded-lg bg-brand-blue px-5 py-2 font-medium text-white transition hover:bg-brand-blue-dark md:block"
              >
                Dashboard
              </Link>

              <LogoutButton />
            </>
          )}

          {/* Mobile Navigation */}
          <MobileMenu isLoggedIn={isLoggedIn} />
        </div>
      </nav>
    </header>
  );
}