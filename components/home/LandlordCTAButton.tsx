"use client";

import Link from "next/link";
import { useState } from "react";

type LandlordCTAButtonProps = {
  isLandlord: boolean;
  isSignedIn: boolean;
};

export default function LandlordCTAButton({
  isLandlord,
  isSignedIn,
}: LandlordCTAButtonProps) {
  const [showMessage, setShowMessage] = useState(false);

  // If the user is already a landlord,
  // send them directly to their landlord dashboard.
  if (isLandlord) {
    return (
      <Link
        href="/dashboard/landlord"
        className="mt-10 inline-flex rounded-xl bg-white px-8 py-4 text-lg font-bold text-blue-900 transition hover:scale-105"
      >
        List Your Property
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowMessage(true)}
        className="mt-10 rounded-xl bg-white px-8 py-4 text-lg font-bold text-blue-900 transition hover:scale-105"
      >
        List Your Property
      </button>

      {/* Message shown to students and signed-out visitors */}
      {showMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-slate-900">
              Landlord Account Required
            </h3>

            <p className="mt-3 text-slate-600">
              You must be signed in as a landlord to list a property.
            </p>

            <div className="mt-6 space-y-3">
              {/* Only show auth options if the visitor is not signed in */}
              {!isSignedIn && (
                <>
                  <Link
                    href="/auth/login"
                    className="block rounded-xl bg-blue-900 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-800"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/auth/signup"
                    className="block rounded-xl border border-slate-300 px-5 py-3 text-center font-semibold text-slate-900 transition hover:bg-slate-50"
                  >
                    Create Landlord Account
                  </Link>
                </>
              )}

              <button
                type="button"
                onClick={() => setShowMessage(false)}
                className="w-full rounded-xl px-5 py-3 font-semibold text-slate-500 transition hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}