import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  // ------------------------------------------------------------
  // ADMIN DASHBOARD
  // ------------------------------------------------------------
  if (user.role === "ADMIN") {
    redirect("/dashboard/admin");
  }

  // ------------------------------------------------------------
  // LANDLORD DASHBOARD
  // ------------------------------------------------------------
  if (user.role === "LANDLORD") {
    redirect("/dashboard/landlord");
  }

  // ------------------------------------------------------------
  // STUDENT DASHBOARD
  // ------------------------------------------------------------
  if (user.role === "STUDENT") {
    redirect("/dashboard/student");
  }

  // ------------------------------------------------------------
  // UNKNOWN ROLE FALLBACK
  // ------------------------------------------------------------
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome to MushaLink
          </h1>

          <p className="mt-2 text-slate-600">
            Your account type does not have a dashboard yet.
          </p>
        </div>
      </div>
    </main>
  );
}