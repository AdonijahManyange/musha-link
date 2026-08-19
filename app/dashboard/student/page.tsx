import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";

export default async function StudentDashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (user.role !== "STUDENT") {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">

        {/* Header */}

        <div className="mb-10">
          <p className="text-sm font-medium text-brand-blue">
            Student Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Welcome back{user.name ? `, ${user.name}` : ""}! 👋
          </h1>

          <p className="mt-2 text-slate-600">
            Find your next home away from home.
          </p>

          <LogoutButton />
        </div>

        {/* Dashboard Cards */}

        <div className="grid gap-6 md:grid-cols-3">

          {/* Find Accommodation */}

          <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Find Accommodation
            </h2>

            <p className="mt-2 text-slate-600">
              Browse available student accommodation near your university.
            </p>

            <Link
              href="/browse"
              className="mt-auto inline-block w-fit rounded-xl bg-brand-blue px-6 py-3 font-semibold text-white transition hover:bg-brand-blue-dark"
            >
              Browse Listings
            </Link>
          </div>

          {/* Saved Listings */}

          <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Saved Listings
            </h2>

            <p className="mt-2 text-slate-600">
              Keep track of accommodation you're interested in.
            </p>

            <Link
              href="/dashboard/student/saved"
              className="mt-auto inline-block w-fit rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View Favorites
            </Link>
          </div>

          {/* Viewing Requests */}

          <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Viewing Requests
            </h2>

            <p className="mt-2 text-slate-600">
              Check the status of your accommodation viewing requests.
            </p>

            <Link
              href="/dashboard/student/requests"
              className="mt-auto inline-block w-fit rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View Requests
            </Link>
          </div>

        </div>

        {/* Account */}

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Account
          </h2>

          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p>
              <span className="font-medium text-slate-900">
                Name:
              </span>{" "}
              {user.name || "Not provided"}
            </p>

            <p>
              <span className="font-medium text-slate-900">
                Email:
              </span>{" "}
              {user.email}
            </p>

            <p>
              <span className="font-medium text-slate-900">
                Account type:
              </span>{" "}
              Student
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}