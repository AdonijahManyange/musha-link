import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  return user;
}