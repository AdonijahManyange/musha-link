"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Heart,
  GraduationCap,
  Info,
} from "lucide-react";

type Props = {
  mobile?: boolean;
  onClick?: () => void;
};

const links = [
  {
    href: "/",
    label: "Home",
    icon: Home,
  },
  {
    href: "/browse",
    label: "Browse",
    icon: Search,
  },
  {
    href: "/saved",
    label: "Saved",
    icon: Heart,
  },
  {
    href: "/universities",
    label: "Universities",
    icon: GraduationCap,
  },
  {
    href: "/about",
    label: "About",
    icon: Info,
  },
];

export default function NavLinks({
  mobile = false,
  onClick,
}: Props) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const Icon = link.icon;

        const active =
          pathname === link.href ||
          (link.href !== "/" &&
            pathname.startsWith(link.href));

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClick}
            className={
              mobile
                ? `flex items-center gap-3 rounded-xl px-4 py-3 text-lg transition ${
                    active
                      ? "bg-slate-100 font-semibold text-brand-blue"
                      : "text-slate-700 hover:bg-slate-100"
                  }`
                : `flex items-center gap-2 transition ${
                    active
                      ? "font-semibold text-brand-blue"
                      : "text-slate-700 hover:text-brand-blue"
                  }`
            }
          >
            <Icon
              size={mobile ? 22 : 18}
              className={
                link.label === "Saved"
                  ? "fill-red-500 text-red-500"
                  : ""
              }
            />

            {link.label}
          </Link>
        );
      })}
    </>
  );
} 