import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import ReviewActions from "./ReviewActions";
import StudentCardButton from "./StudentCardButton";

export default async function StudentVerificationReviewPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const verification = await prisma.studentVerification.findUnique({
    where: { id },
    select: {
      id: true, status: true, method: true, cardFileName: true, createdAt: true,
      user: { select: { name: true, email: true, studentProfile: { select: { phone: true, university: { select: { name: true, city: true } } } } } },
    },
  });
  if (!verification || verification.method !== "STUDENT_CARD" || verification.status !== "PENDING") notFound();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <Link href="/dashboard/admin/student-verifications" className="text-sm font-medium text-slate-600 hover:text-brand-blue">← Student card reviews</Link>
        <h1 className="mt-6 text-3xl font-bold">Review student card</h1>
        <div className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-2">
          <p><span className="text-sm text-slate-500">Student</span><br /><strong>{verification.user.name || "Not provided"}</strong></p>
          <p><span className="text-sm text-slate-500">Account email</span><br /><strong>{verification.user.email}</strong></p>
          <p><span className="text-sm text-slate-500">University</span><br /><strong>{verification.user.studentProfile?.university?.name || "Not selected"}</strong></p>
          <p><span className="text-sm text-slate-500">City</span><br /><strong>{verification.user.studentProfile?.university?.city || "—"}</strong></p>
          <p><span className="text-sm text-slate-500">Phone</span><br /><strong>{verification.user.studentProfile?.phone || "Not provided"}</strong></p>
          <p><span className="text-sm text-slate-500">File</span><br /><strong>{verification.cardFileName}</strong></p>
        </div>
        <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-blue-900">
          Use the card only to confirm current enrollment and whether the name reasonably matches the account. Do not record student ID numbers or unrelated card details in review notes.
        </div>
        <div className="mt-6"><StudentCardButton id={id} /></div>
        <ReviewActions id={id} />
      </div>
    </main>
  );
}
