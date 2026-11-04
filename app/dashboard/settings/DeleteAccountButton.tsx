"use client";

import { useState } from "react";

export default function DeleteAccountButton() {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function deleteAccount() {
    const confirmed = window.confirm(
      "Permanently delete your MushaLink account and associated data? This cannot be undone."
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");

    try {
      const response = await fetch("/api/account", {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete your account.");
      }

      window.location.assign("/auth/login?accountDeleted=1");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Something went wrong while deleting your account."
      );
      setDeleting(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={deleteAccount}
        disabled={deleting}
        className="rounded-xl border border-red-300 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-wait disabled:opacity-60"
      >
        {deleting ? "Deleting Account…" : "Delete Account"}
      </button>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
