"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setSubmitted(true);
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
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

        {!submitted ? (
          <>
            <div className="mb-10 mt-8 text-center">
              <h2 className="text-3xl font-bold text-slate-900">
                Forgot Your Password?
              </h2>

              <p className="mt-3 text-slate-600">
                Enter your email address and we'll send you a link to reset
                your password.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-xl border border-slate-300 p-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-brand-blue py-4 text-lg font-semibold text-white transition hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading
                  ? "Sending..."
                  : "Send Reset Link"}
              </button>
            </form>

            <p className="mt-8 text-center text-slate-600">
              Remember your password?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-brand-blue hover:underline"
              >
                Log in
              </Link>
            </p>
          </>
        ) : (
          <>
            <div className="mb-10 mt-8 text-center">
              <h2 className="text-3xl font-bold text-slate-900">
                Check Your Email
              </h2>

              <p className="mt-4 text-slate-600">
                If an account exists for{" "}
                <span className="font-medium text-slate-900">
                  {email}
                </span>
                , we've sent you a password reset link.
              </p>

              <p className="mt-3 text-sm text-slate-500">
                The link will expire in 1 hour.
              </p>
            </div>

            <Link
              href="/auth/login"
              className="block w-full rounded-xl bg-brand-blue py-4 text-center text-lg font-semibold text-white transition hover:bg-brand-blue-dark"
            >
              Back to Log In
            </Link>
          </>
        )}

      </div>
    </main>
  );
}