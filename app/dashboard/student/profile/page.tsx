import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function StudentProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (user.role !== "STUDENT") {
    redirect("/dashboard");
  }

  const studentProfile =
    await prisma.studentProfile.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        university: true,
      },
    });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">

        {/* Back */}

        <Link
          href="/dashboard/student"
          className="text-sm font-medium text-slate-600 hover:text-brand-blue"
        >
          ← Back to Dashboard
        </Link>

        {/* Header */}

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-blue">
            Student Account
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Student Profile
          </h1>

          <p className="mt-2 text-slate-600">
            Manage your personal information and student details.
          </p>
        </div>

        {/* ================================================== */}
        {/* PROFILE SUMMARY */}
        {/* ================================================== */}

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Information associated with your student account.
              </p>
            </div>

            <Link
              href="/dashboard/student/profile/edit"
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Edit Profile
            </Link>

          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">

            {/* Name */}

            <div>
              <p className="text-sm font-medium text-slate-500">
                Full Name
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {user.name || "Not provided"}
              </p>
            </div>

            {/* Email */}

            <div>
              <p className="text-sm font-medium text-slate-500">
                Email Address
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {user.email}
              </p>
            </div>

            {/* Account */}

            <div>
              <p className="text-sm font-medium text-slate-500">
                Account Type
              </p>

              <p className="mt-1 font-medium text-slate-900">
                Student
              </p>
            </div>

            {/* University */}

            <div>
              <p className="text-sm font-medium text-slate-500">
                University
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {studentProfile?.university?.name || "Not provided"}
              </p>
            </div>

          </div>
        </section>

        {/* ================================================== */}
        {/* CONTACT & LOCATION */}
        {/* ================================================== */}

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-slate-900">
            Contact & Location
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Additional information that helps us understand your
            accommodation needs.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">

            {/* Phone */}

            <div>
              <p className="text-sm font-medium text-slate-500">
                Phone Number
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {studentProfile?.phone || "Not provided"}
              </p>
            </div>

            {/* City */}

            <div>
              <p className="text-sm font-medium text-slate-500">
                City
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {studentProfile?.city || "Not provided"}
              </p>
            </div>

            {/* Province */}

            <div>
              <p className="text-sm font-medium text-slate-500">
                Province
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {studentProfile?.province || "Not provided"}
              </p>
            </div>

            {/* Country */}

            <div>
              <p className="text-sm font-medium text-slate-500">
                Country
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {studentProfile?.country || "Not provided"}
              </p>
            </div>

          </div>
        </section>

        {/* ================================================== */}
        {/* BIO */}
        {/* ================================================== */}

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-slate-900">
            About Me
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Tell us a little about yourself.
          </p>

          <div className="mt-5 rounded-xl bg-slate-50 p-4">

            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {studentProfile?.bio || "No bio provided yet."}
            </p>

          </div>
        </section>

        {/* ================================================== */}
        {/* PRIVACY */}
        {/* ================================================== */}

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">

          <p className="text-sm text-slate-600">
            🔒 Your personal information is private and is not displayed
            publicly unless you choose to share it.
          </p>

        </div>

      </div>
    </main>
  );
}