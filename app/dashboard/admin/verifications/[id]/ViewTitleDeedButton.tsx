"use client";

import { useState } from "react";

type DocumentType =
  | "WATER_BILL"
  | "ELECTRICITY_BILL"
  | "TITLE_DEED";

type Props = {
  verificationId: string;
  documentType: DocumentType;
  label: string;
};

export default function ViewTitleDeedButton({
  verificationId,
  documentType,
  label,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function viewDocument() {
    setLoading(true);

    try {
      const query = new URLSearchParams({
        type: documentType,
      });

      const response = await fetch(
        `/api/admin/verifications/${verificationId}/title-deed?${query.toString()}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to open document."
        );
      }

      if (!data.url) {
        throw new Error(
          "The document URL was not returned."
        );
      }

      // Open the signed URL in a new tab.
      const openedWindow = window.open(
        data.url,
        "_blank",
        "noopener,noreferrer"
      );

      if (!openedWindow) {
        throw new Error(
          "Your browser blocked the new tab. Please allow pop-ups and try again."
        );
      }
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to open document."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={viewDocument}
      disabled={loading}
      className="mt-5 inline-flex rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Opening..." : label}
    </button>
  );
}