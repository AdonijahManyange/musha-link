"use client";

import { useState } from "react";

export default function StudentCardButton({ id }: { id: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function openCard() {
    setBusy(true); setError("");
    try {
      const response = await fetch(`/api/admin/student-verifications/${id}/document`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not open the card.");
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch (e) { setError(e instanceof Error ? e.message : "Could not open the card."); }
    finally { setBusy(false); }
  }
  return <div><button onClick={openCard} disabled={busy} className="rounded-xl bg-brand-blue px-5 py-3 font-semibold text-white hover:bg-brand-blue-dark disabled:opacity-50">{busy ? "Preparing secure link…" : "Open student card"}</button>{error && <p role="alert" className="mt-2 text-sm text-rose-700">{error}</p>}</div>;
}
