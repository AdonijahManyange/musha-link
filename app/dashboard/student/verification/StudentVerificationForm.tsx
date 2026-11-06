"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Verification = {
  method: "SCHOOL_EMAIL" | "STUDENT_CARD" | null;
  status: "NOT_STARTED" | "PENDING" | "APPROVED" | "REJECTED";
  schoolEmail: string | null;
  rejectionReason: string | null;
};

export default function StudentVerificationForm({
  accountEmail,
  initialVerification,
}: {
  accountEmail: string;
  initialVerification: Verification | null;
}) {
  const router = useRouter();
  const [verification, setVerification] = useState<Verification>(initialVerification ?? {
    method: null,
    status: "NOT_STARTED",
    schoolEmail: null,
    rejectionReason: null,
  });
  const [schoolEmail, setSchoolEmail] = useState(verification.schoolEmail ?? "");
  const [code, setCode] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function sendCode() {
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/student/verification/email/send", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolEmail }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not send the code.");
      setVerification({ ...verification, method: "SCHOOL_EMAIL", status: "PENDING", schoolEmail, rejectionReason: null });
      setMessage(`A code was sent to ${schoolEmail}. It expires in 10 minutes.`);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not send the code."); }
    finally { setBusy(false); }
  }

  async function confirmCode() {
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/student/verification/email/confirm", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not verify the code.");
      setVerification({ ...verification, method: "SCHOOL_EMAIL", status: "APPROVED", schoolEmail, rejectionReason: null });
      setMessage("Your student email is verified.");
      router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Could not verify the code."); }
    finally { setBusy(false); }
  }

  async function submitCard() {
    if (!file) { setError("Choose a student card file first."); return; }
    setBusy(true); setError(""); setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("consent", consent ? "yes" : "no");
      const response = await fetch("/api/student/verification/card", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not submit the card.");
      setVerification({ ...verification, method: "STUDENT_CARD", status: "PENDING", rejectionReason: null });
      setMessage("Student card submitted for review.");
      setFile(null);
      router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Could not submit the card."); }
    finally { setBusy(false); }
  }

  const badge = {
    NOT_STARTED: "Not verified",
    PENDING: "Awaiting review / confirmation",
    APPROVED: verification.method === "SCHOOL_EMAIL" ? "School email confirmed" : "Student card reviewed",
    REJECTED: "Needs another submission",
  }[verification.status];

  return (
    <div className="mt-8 space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Current status</h2>
          <span className={`rounded-full px-3 py-1 text-sm font-semibold ${verification.status === "APPROVED" ? "bg-emerald-100 text-emerald-800" : verification.status === "REJECTED" ? "bg-rose-100 text-rose-800" : "bg-slate-100 text-slate-700"}`}>{badge}</span>
        </div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {verification.method === "SCHOOL_EMAIL" && verification.schoolEmail ? `School email: ${verification.schoolEmail}` : verification.method === "STUDENT_CARD" ? "Student card review" : `Your account email is ${accountEmail}. Choose a school email or submit a student card below.`}
        </p>
        {verification.status === "REJECTED" && verification.rejectionReason && <p className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-800">Review note: {verification.rejectionReason}</p>}
        {verification.status === "PENDING" && <p className="mt-3 text-sm text-slate-500">If you submitted a card, an administrator will review it. If you requested an email code, enter it below.</p>}
      </section>

      {verification.status !== "APPROVED" && (
        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Use a school email</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">We&apos;ll email an eight-digit code to your school address. You don&apos;t need to share a student card.</p>
            <label className="mt-5 block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="school-email">School email</label>
            <input id="school-email" type="email" autoComplete="email" value={schoolEmail} onChange={(e) => setSchoolEmail(e.target.value)} placeholder="you@school.edu" className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
            <button type="button" disabled={busy || !schoolEmail} onClick={sendCode} className="mt-4 rounded-xl bg-brand-blue px-4 py-3 font-semibold text-white hover:bg-brand-blue-dark disabled:opacity-50">Send code</button>
            {verification.method === "SCHOOL_EMAIL" && verification.status === "PENDING" && (
              <div className="mt-5 border-t border-slate-200 pt-5 dark:border-slate-700">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="verification-code">Eight-digit code</label>
                <input id="verification-code" inputMode="numeric" autoComplete="one-time-code" maxLength={8} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 8))} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 tracking-[0.25em] text-slate-900 outline-none focus:border-brand-blue dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                <button type="button" disabled={busy || code.length !== 8} onClick={confirmCode} className="mt-3 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800">Confirm email</button>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Submit a student card</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">No school email? Submit a current student card for manual review. PDF, JPG, PNG, or WEBP up to 10 MB.</p>
            <label className="mt-5 block text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="student-card">Student card file</label>
            <input id="student-card" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="mt-2 block w-full text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:font-semibold dark:text-slate-200 dark:file:bg-slate-800" />
            {file && <p className="mt-2 break-all text-xs text-slate-500">Selected: {file.name}</p>}
            <label className="mt-4 flex gap-3 text-sm leading-5 text-slate-600 dark:text-slate-300">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
              I consent to MushaLink using this card only to review my student status. The file will be kept private and deleted after a decision.
            </label>
            <button type="button" disabled={busy || !file || !consent} onClick={submitCard} className="mt-4 rounded-xl bg-brand-blue px-4 py-3 font-semibold text-white hover:bg-brand-blue-dark disabled:opacity-50">Submit for review</button>
          </section>
        </div>
      )}

      {error && <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
      {message && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">{message}</p>}
    </div>
  );
}
