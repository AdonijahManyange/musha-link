"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DocumentType =
  | "WATER_BILL"
  | "ELECTRICITY_BILL"
  | "TITLE_DEED";

type DocumentUploadProps = {
  type: DocumentType;
  title: string;
  description: string;
};

export default function TitleDeedUpload({
  type,
  title,
  description,
}: DocumentUploadProps) {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleUpload() {
    if (!file) {
      setError(`Please select your ${title.toLowerCase()}.`);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("type", type);

      /*
       * Keep the existing endpoint.
       *
       * The backend already accepts:
       * WATER_BILL
       * ELECTRICITY_BILL
       * TITLE_DEED
       */
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
          data.error ||
            `Failed to upload ${title.toLowerCase()}.`
        );
      }

      setSuccess(
        `${title} uploaded successfully.`
      );

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

  const inputId = `verification-${type.toLowerCase()}`;

  return (
    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
      <div>
        <h3 className="font-semibold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-sm text-slate-600">
          {description}
        </p>
      </div>

      <div className="mt-4">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-700"
        >
          Select document
        </label>

        <input
          id={inputId}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(event) => {
            setFile(
              event.target.files?.[0] ?? null
            );

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
        {loading
          ? "Uploading..."
          : `Upload ${title}`}
      </button>
    </div>
  );
}