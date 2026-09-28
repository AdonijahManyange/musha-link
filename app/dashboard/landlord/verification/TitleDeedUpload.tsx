"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TitleDeedUpload() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleUpload() {
    if (!file) {
      setError("Please select your title deed.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "/api/landlord/verification/title-deed",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to upload title deed."
        );
      }

      setSuccess("Title deed uploaded successfully.");
      setFile(null);

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">
        Property ownership
      </h2>

      <p className="mt-2 text-sm text-slate-600">
        Upload your property title deed for MushaLink to review.
      </p>

      <div className="mt-5">
        <label
          htmlFor="titleDeed"
          className="block text-sm font-medium text-slate-700"
        >
          Title deed
        </label>

        <input
          id="titleDeed"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setError("");
            setSuccess("");
          }}
          className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700"
        />

        <p className="mt-2 text-xs text-slate-500">
          PDF, JPG, or PNG. Maximum file size: 10 MB.
        </p>
      </div>

      {file && (
        <p className="mt-3 text-sm text-slate-600">
          Selected:{" "}
          <span className="font-medium text-slate-900">
            {file.name}
          </span>
        </p>
      )}

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <button
        type="button"
        onClick={handleUpload}
        disabled={!file || loading}
        className="mt-5 rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload Title Deed"}
      </button>
    </div>
  );
}