"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  House,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [role, setRole] = useState<"STUDENT" | "LANDLORD" | null>(null);
  const [method, setMethod] = useState<"GOOGLE" | "EMAIL" | null>(null);
  const [universities, setUniversities] = useState<{ id: string; name: string; city: string }[]>([]);
  const [universityId, setUniversityId] = useState("");
  const [schoolEmail, setSchoolEmail] = useState("");
  const [useStudentCard, setUseStudentCard] = useState(false);
  const [studentSetupComplete, setStudentSetupComplete] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/universities")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) setUniversities(data);
      })
      .catch((error) => console.error("Could not load universities:", error));
  }, []);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!role) {
      alert("Please select Student or Landlord.");
      return;
    }

    if (role === "STUDENT" && (!universityId || (!useStudentCard && !schoolEmail.trim()))) {
      alert("Select your university and enter your school email, or choose student card review.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          universityId: role === "STUDENT" ? universityId : undefined,
          schoolEmail: role === "STUDENT" ? schoolEmail.trim() : undefined,
          verificationMethod: role === "STUDENT" ? (useStudentCard ? "STUDENT_CARD" : "SCHOOL_EMAIL") : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      alert("Account created successfully!");

      router.push("/auth/login");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignup() {
    if (!role) {
      alert("Please select Student or Landlord first.");
      return;
    }

    try {
      const response = await fetch("/api/auth/signup-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          universityId: role === "STUDENT" ? universityId : undefined,
          schoolEmail: role === "STUDENT" ? schoolEmail.trim() : undefined,
          verificationMethod: role === "STUDENT" ? (useStudentCard ? "STUDENT_CARD" : "SCHOOL_EMAIL") : undefined,
        }),
      });

      if (!response.ok) {
        alert("Something went wrong. Please try again.");
        return;
      }

      await signIn("google", {
        callbackUrl:
          role === "LANDLORD"
            ? "/dashboard/landlord"
            : "/dashboard/student",
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-12 shadow-xl">

        <Image
          src="/images/MushaLink Logo.png"
          alt="MushaLink"
          width={220}
          height={70}
          className="mx-auto h-20 w-auto"
        />

        <div className="mb-10 mt-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Create your account
          </h2>

          <p className="mt-3 text-slate-600">
            Connecting students with trusted accommodation
            <br />
            across Zimbabwe.
          </p>
        </div>

        {/* STEP 1 — ROLE */}
        {!role && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                How will you use MushaLink?
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Choose the account type that best describes you.
              </p>
            </div>

            <button
              type="button"
            onClick={() => { setRole("STUDENT"); setStudentSetupComplete(false); }}
              className="w-full rounded-2xl border border-slate-300 p-5 text-left transition hover:border-brand-blue hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <GraduationCap
                  size={32}
                  className="text-brand-blue"
                />

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Student
                  </h3>

                  <p className="text-sm text-slate-600">
                    Find accommodation near your university.
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
            onClick={() => { setRole("LANDLORD"); setStudentSetupComplete(true); }}
              className="w-full rounded-2xl border border-slate-300 p-5 text-left transition hover:border-brand-blue hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <House
                  size={32}
                  className="text-brand-blue"
                />

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Landlord
                  </h3>

                  <p className="text-sm text-slate-600">
                    List your property and connect with students.
                  </p>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* STUDENT SETUP — UNIVERSITY AND SCHOOL EMAIL */}
        {role === "STUDENT" && !studentSetupComplete && (
          <div className="space-y-5">
            <button type="button" onClick={() => setRole(null)} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-blue">
              <ArrowLeft size={16} /> Change account type
            </button>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Your university details</h3>
              <p className="mt-1 text-sm text-slate-600">Choose your university, then use a school email or submit your student card for review after signup.</p>
            </div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="signup-university">University</label>
            <select id="signup-university" value={universityId} onChange={(event) => setUniversityId(event.target.value)} required className="-mt-3 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900">
              <option value="">Select your university</option>
              {universities.map((university) => <option key={university.id} value={university.id}>{university.name} — {university.city}</option>)}
            </select>
            {!useStudentCard && (
              <>
                <label className="block text-sm font-medium text-slate-700" htmlFor="signup-school-email">School email</label>
                <input id="signup-school-email" type="email" autoComplete="email" value={schoolEmail} onChange={(event) => setSchoolEmail(event.target.value)} placeholder="you@university.edu" required className="-mt-3 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900" />
                <p className="-mt-3 text-xs text-slate-500">You&apos;ll confirm access with a code sent to this address.</p>
              </>
            )}
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200">
              <input type="checkbox" checked={useStudentCard} onChange={(event) => setUseStudentCard(event.target.checked)} className="mt-1" />
              <span><strong className="block">I can&apos;t use a school email</strong>Submit a current student card for manual review after signup. You can still try email verification later.</span>
            </label>
            <button type="button" disabled={!universityId || (!useStudentCard && !schoolEmail.trim())} onClick={() => setStudentSetupComplete(true)} className="w-full rounded-xl bg-brand-blue py-4 font-semibold text-white disabled:opacity-50">Continue</button>
          </div>
        )}

        {/* STEP 2 — AUTH METHOD */}
        {role && (role === "LANDLORD" || studentSetupComplete) && !method && (
          <div className="space-y-5">
            <button
              type="button"
              onClick={() => { setRole(null); setStudentSetupComplete(false); }}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-blue"
            >
              <ArrowLeft size={16} />
              Change account type
            </button>

            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                Create your{" "}
                {role === "STUDENT" ? "Student" : "Landlord"} account
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Choose how you'd like to create your account.
              </p>
              {role === "STUDENT" && (
                <div className="mt-3 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <p>
                    {universities.find((university) => university.id === universityId)?.name || "University selected"}
                    <span className="mx-2 text-slate-400">·</span>
                    {useStudentCard ? "Student card review selected" : schoolEmail}
                  </p>
                  {useStudentCard && (
                    <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                      Finish creating your account, then sign in and upload your card from Student Verification.
                    </p>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleGoogleSignup}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white py-4 font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
            >
              <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5 shrink-0">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.74 7.18l7.73 6c4.51-4.18 7.05-10.34 7.05-17.65Z" />
                <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.53 2.56 10.78l7.97-6.19Z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.88 2.3-8.18 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
              </svg>

              Continue with Google
            </button>

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />

              <span className="text-sm text-slate-400">
                OR
              </span>

              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <button
              type="button"
              onClick={() => setMethod("EMAIL")}
              className="w-full rounded-xl bg-brand-blue py-4 font-semibold text-white transition hover:bg-brand-blue-dark"
            >
              Continue with Email
            </button>
          </div>
        )}

        {/* STEP 3 — EMAIL SIGNUP */}
        {role && method === "EMAIL" && (
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <button
              type="button"
              onClick={() => setMethod(null)}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-blue"
            >
              <ArrowLeft size={16} />
              Back to signup options
            </button>

            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                Create your{" "}
                {role === "STUDENT" ? "Student" : "Landlord"} account
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Enter your details below.
              </p>
            </div>

            <div>
              <label className="mb-2 block font-medium text-slate-700">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 caret-slate-900 placeholder:text-slate-400 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-slate-700">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === "STUDENT" ? "Email address for your account" : "Enter your email address"}
                required
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 caret-slate-900 placeholder:text-slate-400 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-slate-700">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 pr-12 text-slate-900 caret-slate-900 placeholder:text-slate-400 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <p className="text-center text-sm text-slate-500">
              By creating an account, you agree to our{" "}
              <span className="font-medium text-brand-blue">
                Terms of Service
              </span>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-medium text-brand-blue hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand-blue py-4 text-lg font-semibold text-white transition hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading
                ? "Creating Account..."
                : role === "STUDENT"
                ? "Create Student Account"
                : "Create Landlord Account"}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-slate-600">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-brand-blue hover:underline dark:text-blue-300"
          >
            Log In
          </Link>
        </p>

      </div>
    </main>
  );
}
