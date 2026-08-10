import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

export default async function LandlordDashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (user.role !== "LANDLORD") {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">

        {/* Header */}

        <div className="mb-10">
          <p className="text-sm font-medium text-brand-blue">
            Landlord Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Welcome back{user.name ? `, ${user.name}` : ""}! 👋
          </h1>

          <p className="mt-2 text-slate-600">
            Manage your properties and connect with students.
          </p>

            <LogoutButton />
        </div>

        {/* Dashboard Cards */}

        <div className="grid gap-6 md:grid-cols-3">

          {/* Listings */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              My Listings
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Create and manage your student accommodation listings.
            </p>

            <button className="mt-6 rounded-xl bg-brand-blue px-5 py-3 font-semibold text-white transition hover:bg-brand-blue-dark">
              Manage Listings
            </button>
          </div>

          {/* Add Property */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Add Property
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              List a new property and make it available to students.
            </p>

            <button className="mt-6 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50">
              Add Listing
            </button>
          </div>

          {/* Viewing Requests */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Viewing Requests
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Review students interested in viewing your properties.
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
              Landlord
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}