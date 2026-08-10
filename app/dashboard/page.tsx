import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (user.role === "STUDENT") {
    redirect("/dashboard/student");
  }

  if (user.role === "LANDLORD") {
    redirect("/dashboard/landlord");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome to MushaLink
        </h1>

        <p className="mt-2 text-slate-600">
          Your account does not have a dashboard yet.
        </p>
      </div>
    </main>
  );
}