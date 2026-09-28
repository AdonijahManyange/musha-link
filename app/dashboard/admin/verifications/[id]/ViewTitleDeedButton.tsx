"use client";

import { useState } from "react";

type Props = {
  verificationId: string;
};

export default function ViewTitleDeedButton({
  verificationId,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function viewTitleDeed() {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/verifications/${verificationId}/title-deed`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to open title deed."
        );
      }

      window.open(
        data.url,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to open title deed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={viewTitleDeed}
      disabled={loading}
      className="mt-5 inline-flex rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Opening..." : "View Title Deed"}
    </button>
  );
}