"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    try {
        const response = await fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
        });

        const data = await response.json();

        if (!response.ok) {
        alert(data.error);
        return;
        }

        alert("Login successful!");

        console.log(data.user);

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
            Welcome Back
          </h2>

          <p className="mt-3 text-slate-600">
            Sign in to continue to your MushaLink account.
          </p>
        </div>

        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
          <GoogleSignInButton />

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-sm text-slate-400">OR</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          
          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Email Address
            </label>

            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
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
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-300 p-3 pr-12 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-blue py-4 text-lg font-semibold text-white transition hover:bg-brand-blue-dark"
          >
            {loading ? "Logging In..." : "Log In"}            
          </button>

        </form>

        <p className="mt-8 text-center text-slate-600">
          Don't have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-semibold text-brand-blue hover:underline"
          >
            Create one
          </Link>
        </p>

      </div>
    </main>
  );
}