import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export default async function AccountSettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const profileHref =
    user.role === "STUDENT"
      ? "/dashboard/student/profile"
      : "/dashboard/landlord/profile";

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">

        {/* Back */}
        <Link
          href="/dashboard"
          className="text-sm font-medium text-slate-600 transition hover:text-brand-blue"
        >
          ← Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-blue">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Account Settings
          </h1>

          <p className="mt-2 text-slate-600">
            Manage your account information, security, and preferences.
          </p>
        </div>

        {/* Account Information */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Account Information
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Basic information associated with your MushaLink account.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Full Name
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {user.name || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Email Address
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Account Type
              </p>

              <p className="mt-1 font-medium capitalize text-slate-900">
                {user.role.toLowerCase()}
              </p>
            </div>

          </div>

          <div className="mt-6">
            <Link
              href={profileHref}
              className="inline-flex rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Edit Profile
            </Link>
          </div>
        </section>

        {/* Security */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Security
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Manage your password and account security.
          </p>

          <div className="mt-6">
            <Link
              href="/auth/forgot-password"
              className="inline-flex rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Change Password
            </Link>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="mt-8 rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-red-600">
            Danger Zone
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Permanently remove your MushaLink account and associated data.
          </p>

          <div className="mt-6">
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-400"
            >
              Delete Account
            </button>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Account deletion will be available here once the deletion
            workflow has been implemented.
          </p>
        </section>

      </div>
    </main>
  );
}