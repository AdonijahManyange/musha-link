import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { isStudentVerified } from "@/lib/student-verification";
import StudentViewingRequestsContent from "./ViewingRequestsContent";

export default async function StudentViewingRequestsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (user.role !== "STUDENT") {
    redirect("/dashboard");
  }

  if (!(await isStudentVerified(user.id))) {
    redirect("/dashboard/student/verification");
  }

  return <StudentViewingRequestsContent />;
}
