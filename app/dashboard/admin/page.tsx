import VerificationQueue from "./VerificationQueue";
import { requireAdmin } from "@/lib/admin";

export default async function AdminDashboard() {
  const admin = await requireAdmin();

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div>
        <p className="text-sm font-semibold text-brand-blue">
          Admin Dashboard
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Welcome, {admin.name || "Admin"}
        </h1>


        <p className="mt-2 text-slate-600">
          Manage MushaLink verification and platform activity.
        </p>
      </div>
      <VerificationQueue />
    </main>
  );
}