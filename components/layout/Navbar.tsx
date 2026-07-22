import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <nav className="mx-auto flex h-29 w-full items-center justify-between px-4 py-1">

        {/* Logo */}
        <div>
          <Link href="/#top">
            <Image
              src="/images/MushaLink Logo.png"
              alt="MushaLink"
              width={260}
              height={82}
              priority
            />
          </Link>
        </div>

        {/* Navigation */}
        <ul className="hidden gap-8 font-medium text-slate-700 md:flex">
          <li>
            <a href="#top" className="hover:text-[#1C3769]">
              Home
            </a>
          </li>

          <li>
            <a href="#browse" className="hover:text-[#1C3769]">
              Browse
            </a>
          </li>

          <li>
            <a href="#universities" className="hover:text-[#1C3769]">
              Universities
            </a>
          </li>

          <li>
            <a href="#about" className="hover:text-[#1C3769]">
              About
            </a>
          </li>
        </ul>

        {/* Buttons */}
        <div className="flex gap-3">
          <button className="rounded-lg px-4 py-2 text-slate-700 hover:bg-slate-100">
            Login
          </button>

          <button className="rounded-lg bg-[#1C3769] px-5 py-2 font-medium text-white hover:bg-[#162D57]">
            Sign Up
          </button>
        </div>
      </nav>
    </header>
  );
}