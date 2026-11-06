import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export default async function StudentVerificationQueuePage() {
  await requireAdmin();
  const verifications = await prisma.studentVerification.findMany({
    where: { status: "PENDING", method: "STUDENT_CARD" },
    select: { id: true, createdAt: true, cardFileName: true, user: { select: { name: true, email: true, studentProfile: { select: { university: { select: { name: true } } } } } } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <Link href="/dashboard/admin" className="text-sm font-medium text-slate-600 hover:text-brand-blue">← Admin dashboard</Link>
        <h1 className="mt-6 text-3xl font-bold">Student card reviews</h1>
        <p className="mt-2 text-slate-600">Check the card only to confirm current student status. The private file is deleted after you record a decision.</p>
        <div className="mt-8 space-y-4">
          {verifications.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <h2 className="font-semibold">No student cards awaiting review</h2>
              <p className="mt-2 text-sm text-slate-600">New manual verification requests will appear here.</p>
            </div>
          ) : verifications.map((verification) => (
            <Link key={verification.id} href={`/dashboard/admin/student-verifications/${verification.id}`} className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-brand-blue/40 hover:shadow-md">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{verification.user.name || "Student"}</h2>
                  <p className="mt-1 text-sm text-slate-600">{verification.user.email}</p>
                  <p className="mt-1 text-sm text-slate-600">University: {verification.user.studentProfile?.university?.name || "Not selected"}</p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">Pending</span>
              </div>
              <p className="mt-4 text-sm text-slate-500">Submitted {verification.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Harare" })} · {verification.cardFileName}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
