"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
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

  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!role) {
      alert("Please select Student or Landlord.");
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
              onClick={() => setRole("STUDENT")}
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
              onClick={() => setRole("LANDLORD")}
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

        {/* STEP 2 — AUTH METHOD */}
        {role && !method && (
          <div className="space-y-5">
            <button
              type="button"
              onClick={() => setRole(null)}
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
            </div>

            <button
              type="button"
              onClick={handleGoogleSignup}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white py-4 font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
            >
              <span className="text-lg font-bold text-[#4285F4]">
                G
              </span>

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
                placeholder="Enter your email address"
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
              <span className="font-medium text-brand-blue">
                Privacy Policy
              </span>
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
            className="font-semibold text-brand-blue hover:underline"
          >
            Log In
          </Link>
        </p>

      </div>
    </main>
  );
}