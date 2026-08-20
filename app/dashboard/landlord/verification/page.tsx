import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import StartVerificationButton from "@/components/StartVerificationButton";

export default async function LandlordVerificationPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (user.role !== "LANDLORD") {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">

        {/* Back */}
        <Link
          href="/dashboard/landlord"
          className="inline-flex items-center text-sm font-medium text-slate-600 transition hover:text-brand-blue"
        >
          ← Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-blue">
            Account Verification
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Verify your landlord account
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Verification helps students know that the landlords and properties
            listed on MushaLink are legitimate.
          </p>
        </div>

        {/* Status */}
        <div className="mt-8 rounded-2xl border border-amber-500 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <div className="mt-1 h-3 w-3 rounded-full bg-amber-500" />

            <div>
              <h2 className="font-semibold text-slate-900">
                Verification required
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Submit the required documents below. Our team will review them
                before your account is verified.
              </p>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            What you'll need
          </h2>

          <div className="mt-5 space-y-4">

            <div className="rounded-xl bg-slate-50 p-4">
              <h3 className="font-semibold text-slate-900">
                1. Government-issued ID
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Upload a clear copy of your national ID, passport, or driver's
                license.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <h3 className="font-semibold text-slate-900">
                2. Proof of address
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Upload a recent utility bill or another accepted proof of
                address.
              </p>
            </div>

          </div>
        </div>

        {/* Upload Form */}
        <div className="mt-8 space-y-6">

          {/* Government ID */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <label
              htmlFor="governmentId"
              className="block text-lg font-semibold text-slate-900"
            >
              Government-issued ID
            </label>

            <p className="mt-1 text-sm text-slate-600">
              PDF, JPG, or PNG
            </p>

            <input
              id="governmentId"
              name="governmentId"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="mt-4 block w-full rounded-xl border border-slate-900 bg-white p-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:font-medium file:text-slate-700 hover:file:bg-slate-200"
            />
          </div>

          {/* Utility Bill */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <label
              htmlFor="utilityBill"
              className="block text-lg font-semibold text-slate-900"
            >
              Utility bill / Proof of address
            </label>

            <p className="mt-1 text-sm text-slate-600">
              Upload a recent utility bill or accepted proof of address.
            </p>

            <input
              id="utilityBill"
              name="utilityBill"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="mt-4 block w-full rounded-xl border border-slate-900 bg-white p-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:font-medium file:text-slate-700 hover:file:bg-slate-200"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <StartVerificationButton />
          </div>

        </div>

        {/* Privacy Notice */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-600">
            🔒 Your verification documents are private and will only be used
            for account verification. They will not be publicly displayed on
            MushaLink.
          </p>
        </div>

      </div>
    </main>
  );
}