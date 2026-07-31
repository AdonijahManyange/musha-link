"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  House,
  Eye,
  EyeOff,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [role, setRole] = useState<"STUDENT" | "LANDLORD">("STUDENT");
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

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

        <div className="mb-12 mt-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Create your account
          </h2>

          <p className="mt-3 text-slate-600">
            Connecting students with trusted accommodation
            <br />
            across Zimbabwe.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-slate-300 p-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
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
              className="w-full rounded-xl border border-slate-300 p-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
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
                className="w-full rounded-xl border border-slate-300 p-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"></input>

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

          <div>
            <label className="mb-3 block font-medium text-slate-700">
              Continue as
            </label>

            <div className="grid gap-4">
                              <button
                type="button"
                onClick={() => setRole("STUDENT")}
                className={`rounded-2xl border p-5 text-left transition-all duration-200 ${
                  role === "STUDENT"
                    ? "border-brand-blue bg-brand-blue/15 shadow-md"
                    : "border-slate-300 hover:border-brand-blue hover:shadow-sm"
                }`}
              >
                <div className="flex items-center gap-4">
                  <GraduationCap
                    size={30}
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
                className={`rounded-2xl border p-5 text-left transition-all duration-200 ${
                  role === "LANDLORD"
                    ? "border-brand-blue bg-brand-blue/15 shadow-md"
                    : "border-slate-300 hover:border-brand-blue hover:shadow-sm"
                }`}
              >
                <div className="flex items-center gap-4">
                  <House
                    size={30}
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
          </div>

          <p className="text-center text-sm text-slate-500">
            By creating an account, you agree to our{" "}
            <span className="font-medium text-brand-blue">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="font-medium text-brand-blue">
              Privacy Policy
            </span>.
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