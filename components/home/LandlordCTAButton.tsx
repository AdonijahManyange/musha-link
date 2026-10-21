"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  X,
} from "lucide-react";

type LandlordCTAButtonProps = {
  isLandlord: boolean;
  isSignedIn: boolean;
};

export default function LandlordCTAButton({
  isLandlord,
  isSignedIn,
}: LandlordCTAButtonProps) {
  const [showMessage, setShowMessage] = useState(false);

  // Existing landlords can go straight to their dashboard.
  if (isLandlord) {
    return (
      <Link
        href="/dashboard/landlord"
        className="mt-10 inline-flex items-center justify-center gap-3 rounded-xl bg-slate-950 px-8 py-4 text-lg font-bold text-blue-300 shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-slate-900 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900"
      >
        List Your Property
        <ArrowRight size={20} />
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowMessage(true)}
        className="mt-10 inline-flex items-center justify-center gap-3 rounded-xl bg-slate-950 px-8 py-4 text-lg font-bold text-blue-300 shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-slate-900 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900"
      >
        List Your Property
        <ArrowRight size={20} />
      </button>

      {showMessage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
          onMouseDown={(event) => {
            // Close the modal when the backdrop itself is clicked.
            if (event.target === event.currentTarget) {
              setShowMessage(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="landlord-modal-title"
            className="relative w-full max-w-md rounded-2xl border border-border bg-surface p-6 text-text-primary shadow-2xl sm:p-8"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowMessage(false)}
              aria-label="Close dialog"
              className="absolute right-4 top-4 rounded-lg p-2 text-text-muted transition hover:bg-surface-secondary hover:text-text-primary"
            >
              <X size={20} />
            </button>

            {/* Icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
              <Building2 size={28} />
            </div>

            <h2
              id="landlord-modal-title"
              className="mt-5 text-2xl font-bold tracking-tight"
            >
              Start Listing Your Property
            </h2>

            <p className="mt-3 text-sm leading-6 text-text-secondary">
              MushaLink helps landlords connect with university students
              looking for accommodation in Zimbabwe. To list a property,
              you need a landlord account.
            </p>

            {/* Benefits */}
            <div className="mt-5 space-y-3">
              {[
                "Create and manage property listings",
                "Receive student viewing requests",
                "Manage enquiries from your dashboard",
              ].map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-emerald-500"
                  />

                  <span className="text-sm text-text-secondary">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            {/* Navigation options */}
            <div className="mt-7 space-y-3">
              {!isSignedIn ? (
                <>
                  <Link
                    href="/auth/signup"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue px-5 py-3.5 text-sm font-bold text-white transition hover:bg-brand-blue-dark"
                  >
                    Create Landlord Account
                    <ArrowRight size={17} />
                  </Link>

                  <Link
                    href="/auth/login"
                    className="flex w-full items-center justify-center rounded-xl border border-border bg-surface px-5 py-3.5 text-sm font-semibold text-text-primary transition hover:bg-surface-secondary"
                  >
                    Already have an account? Sign in
                  </Link>
                </>
              ) : (
                <Link
                  href="/dashboard/student"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue px-5 py-3.5 text-sm font-bold text-white transition hover:bg-brand-blue-dark"
                >
                  Go to My Dashboard
                  <ArrowRight size={17} />
                </Link>
              )}

              <button
                type="button"
                onClick={() => setShowMessage(false)}
                className="w-full rounded-xl px-5 py-3 text-sm font-semibold text-text-muted transition hover:bg-surface-secondary hover:text-text-primary"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}