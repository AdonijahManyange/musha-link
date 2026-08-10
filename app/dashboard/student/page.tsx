import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

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

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Find Accommodation
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Browse available student accommodation near your university.
            </p>

            <button className="mt-6 rounded-xl bg-brand-blue px-5 py-3 font-semibold text-white transition hover:bg-brand-blue-dark">
              Browse Listings
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Saved Listings
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Keep track of accommodation you're interested in.
            </p>

            <button className="mt-6 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50">
              View Favorites
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Viewing Requests
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Check the status of your accommodation viewing requests.
            </p>

            <button className="mt-6 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50">
              View Requests
            </button>
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