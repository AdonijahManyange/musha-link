"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ReviewActions({ id }: { id: string }) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function review(action: "APPROVE" | "REJECT") {
    setBusy(true); setError("");
    try {
      const response = await fetch(`/api/admin/student-verifications/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, rejectionReason: reason }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not record the decision.");
      router.push("/dashboard/admin/student-verifications");
      router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Could not record the decision."); }
    finally { setBusy(false); }
  }

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="font-semibold">Record a decision</h2>
      <label htmlFor="reason" className="mt-4 block text-sm font-medium">Review note (required if rejecting)</label>
      <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} maxLength={500} rows={3} className="mt-2 w-full rounded-xl border border-slate-300 p-3 text-sm" placeholder="For example: the card is expired or the name is unreadable." />
      {error && <p role="alert" className="mt-3 text-sm text-rose-700">{error}</p>}
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" disabled={busy} onClick={() => review("APPROVE")} className="rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50">Approve</button>
        <button type="button" disabled={busy || !reason.trim()} onClick={() => review("REJECT")} className="rounded-xl bg-rose-700 px-5 py-3 font-semibold text-white hover:bg-rose-800 disabled:opacity-50">Reject</button>
      </div>
      <p className="mt-4 text-xs text-slate-500">After either decision, the uploaded card file is removed from private storage.</p>
    </div>
  );
}
