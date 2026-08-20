import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";

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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {/* Account Verification */}

          <div className="flex h-full flex-col rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm font-semibold text-amber-600">
                Account Security
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                Verify Account
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Verify your identity so students can trust that you are a
                legitimate landlord.
              </p>
            </div>

            <Link
              href="/dashboard/landlord/verification"
              className="mt-auto inline-block w-fit rounded-xl bg-brand-blue px-5 py-3 font-semibold text-white transition hover:bg-brand-blue-dark"
            >
              Start Verification
            </Link>
          </div>

          {/* Listings */}

          <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              My Listings
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Create and manage your student accommodation listings.
            </p>

            <Link
              href="/dashboard/landlord/listings"
              className="mt-auto inline-block w-fit rounded-xl bg-brand-blue px-5 py-3 font-semibold text-white transition hover:bg-brand-blue-dark"
            >
              Manage Listings
            </Link>
          </div>

          {/* Add Property */}

          <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Add Property
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              List a new property and make it available to students.
            </p>

            <Link
              href="/dashboard/landlord/listings/new"
              className="mt-auto inline-block w-fit rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Add Listing
            </Link>
          </div>

          {/* Viewing Requests */}

          <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Viewing Requests
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Review students interested in viewing your properties.
            </p>

            <Link
              href="/dashboard/landlord/requests"
              className="mt-auto inline-block w-fit rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
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
              Landlord
            </p>

          </div>
        </div>

      </div>
    </main>
  );
}