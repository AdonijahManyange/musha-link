import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import StudentVerificationForm from "./StudentVerificationForm";

export const metadata: Metadata = { title: "Student Verification | MushaLink" };

export default async function StudentVerificationPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  if (user.role !== "STUDENT") redirect("/dashboard");

  const verification = await prisma.studentVerification.findUnique({
    where: { userId: user.id },
    select: { method: true, status: true, schoolEmail: true, rejectionReason: true },
  });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl">
        <Link href="/dashboard/student" className="text-sm font-medium text-brand-blue hover:underline dark:text-blue-300">← Student dashboard</Link>
        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-blue dark:text-blue-300">Student status</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Verify you&apos;re a student</h1>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
            This optional check helps landlords understand that you are currently studying. It does not use paid ID or selfie verification.
          </p>
        </div>
        <StudentVerificationForm
          accountEmail={user.email}
          initialVerification={verification ? {
            method: verification.method,
            status: verification.status,
            schoolEmail: verification.schoolEmail,
            rejectionReason: verification.rejectionReason,
          } : null}
        />
      </div>
    </main>
  );
}
