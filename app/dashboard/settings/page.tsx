import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export default async function AccountSettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const isAdmin = user.role === "ADMIN";

  const profileHref =
    user.role === "STUDENT"
      ? "/dashboard/student/profile"
      : user.role === "LANDLORD"
        ? "/dashboard/landlord/profile"
        : null;

  const roleLabel =
    user.role === "ADMIN"
      ? "Administrator"
      : user.role === "LANDLORD"
        ? "Landlord"
        : "Student";

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-5xl">

        {/* Back */}
        <Link
          href={isAdmin ? "/dashboard/admin" : "/dashboard"}
          className="inline-flex text-sm font-medium text-slate-600 transition hover:text-brand-blue"
        >
          ← Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-blue">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            My Account
          </h1>

          <p className="mt-2 text-slate-600">
            Manage your account information, security, and preferences.
          </p>
        </div>

        {/* Profile Summary */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

            {/* Avatar */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xl font-bold text-brand-blue">
              {user.name
                ? user.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                : "U"}
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {user.name || "Unnamed User"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {user.email}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-brand-blue">
                  {roleLabel}
                </span>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Active
                </span>
              </div>
            </div>
          </div>
        </section>

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

              <p className="mt-1 font-medium text-slate-900">
                {roleLabel}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Account Status
              </p>

              <p className="mt-1 font-medium text-emerald-700">
                Active
              </p>
            </div>

          </div>

          {/* Only students and landlords have editable profiles */}
          {profileHref && (
            <div className="mt-6">
              <Link
                href={profileHref}
                className="inline-flex rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-blue/30 hover:bg-slate-50 hover:text-brand-blue"
              >
                Edit Profile
              </Link>
            </div>
          )}
        </section>

        {/* Admin Access */}
        {isAdmin && (
          <section className="mt-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Administrator Access
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Your account has administrative access to MushaLink.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">
                  Role
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  Administrator
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">
                  Access
                </p>

                <p className="mt-1 font-semibold text-emerald-700">
                  Full Admin Access
                </p>
              </div>

            </div>

            <div className="mt-5">
              <Link
                href="/dashboard/admin"
                className="inline-flex rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Open Admin Dashboard
                <span className="ml-2">→</span>
              </Link>
            </div>
          </section>
        )}

        {/* Security */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Security
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Manage your password and account security.
          </p>

          <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
            <div>
              <p className="font-medium text-slate-900">
                Password
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Update your account password.
              </p>
            </div>

            <Link
              href="/auth/forgot-password"
              className="shrink-0 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-brand-blue/30 hover:bg-slate-50 hover:text-brand-blue"
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