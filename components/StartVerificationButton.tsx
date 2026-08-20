"use client";

import { useState } from "react";

export default function StartVerificationButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startVerification() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/landlord/verification/start",
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to start verification."
        );
      }

      if (!data.url) {
        throw new Error(
          "Sovera did not return a verification URL."
        );
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to start verification."
      );

      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={startVerification}
        disabled={loading}
        className="rounded-xl bg-brand-blue px-6 py-3 font-semibold text-white transition hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Starting verification..." : "Start Identity Verification"}
      </button>

      {error && (
        <p className="mt-3 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}