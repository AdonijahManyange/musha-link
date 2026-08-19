"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="hidden rounded-lg border border-slate-300 px-5 py-2 font-medium text-slate-700 transition hover:bg-slate-100 md:block"
    >
      Logout
    </button>
  );
}