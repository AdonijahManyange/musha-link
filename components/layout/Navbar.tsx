import Link from "next/link";
import Image from "next/image";
import MessagesButton from "./MessagesButton";
import { getCurrentUser } from "@/lib/auth";
import MobileMenu from "./MobileMenu";
import NavLinks from "./NavLinks";
import ProfileMenu from "./ProfileMenu";
import NotificationBell from "./NotificationBell";
import ThemeToggle from "./ThemeToggle";

export default async function Navbar() {
  const user = await getCurrentUser();
  const isLoggedIn = !!user;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white transition-colors duration-200 dark:border-slate-700 dark:bg-slate-900">
      <nav className="mx-auto flex w-full items-center justify-between px-4 py-3 md:h-28">
        {/* LOGO */}
        <div className="shrink-0">
          <Link
            href="/#top"
            aria-label="MushaLink home"
            className="block"
          >
            {/* Light-mode logo */}
            <Image
              src="/images/MushaLink Logo.png"
              alt="MushaLink"
              width={220}
              height={70}
              priority
              className="h-10 w-auto md:h-14 dark:hidden"
            />

            {/* Dark-mode logo */}
            <Image
              src="/images/MushaLink-Logo-Dark.png"
              alt="MushaLink"
              width={220}
              height={70}
              priority
              className="hidden h-10 w-auto md:h-14 dark:block"
            />
          </Link>
        </div>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-8 font-medium text-slate-700 dark:text-slate-200 md:flex">
          <NavLinks />
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {!isLoggedIn ? (
            <>
              <Link
                href="/auth/login"
                className="hidden rounded-lg px-4 py-2 text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 md:block"
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

              <MessagesButton />
              <NotificationBell />

              <div className="hidden md:block">
                <ProfileMenu
                  name={user.name}
                  profilePhotoUrl={
                    user.role === "STUDENT"
                      ? user.studentProfile?.profilePhotoUrl || null
                      : user.landlordProfile?.profilePhotoUrl || null
                  }
                  profileHref={
                    user.role === "STUDENT"
                      ? "/dashboard/student/profile"
                      : "/dashboard/landlord/profile"
                  }
                />
              </div>
            </>
          )}

          {/* MOBILE NAVIGATION */}
          <MobileMenu
            isLoggedIn={isLoggedIn}
            name={user?.name ?? null}
            profilePhotoUrl={
              user?.role === "STUDENT"
                ? user.studentProfile?.profilePhotoUrl ?? null
                : user?.landlordProfile?.profilePhotoUrl ?? null
            }
            profileHref={
              user?.role === "STUDENT"
                ? "/dashboard/student/profile"
                : "/dashboard/landlord/profile"
            }
          />
        </div>
      </nav>
    </header>
  );
}