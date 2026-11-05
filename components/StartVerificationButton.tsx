"use client";

import { useState } from "react";

export default function StartVerificationButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fallbackError =
    "Identity verification is temporarily unavailable. Please try again later. If the problem continues, contact support.";

  async function startVerification() {
    // Open the window immediately while we're still inside
    // the user's click event. This prevents popup blockers.
    const verificationWindow = window.open(
      "about:blank",
      "_blank"
    );

    let userFacingError = fallbackError;

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
        userFacingError = data.error || fallbackError;
        throw new Error("Unable to start verification.");
      }

      if (!data.url) {
        throw new Error("Invalid verification URL.");
      }

      // Send the newly opened window to Didit.
      if (verificationWindow) {
        verificationWindow.location.href = data.url;
      } else {
        // Fallback if the browser blocked the popup.
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(error);

      // Close the blank window if something went wrong.
      if (verificationWindow) {
        verificationWindow.close();
      }

      setError(userFacingError);

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
        {loading
          ? "Starting verification..."
          : "Start Identity Verification"}
      </button>

      {error && (
        <p className="mt-3 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
