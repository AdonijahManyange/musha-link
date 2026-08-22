"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type University = {
  id: string;
  name: string;
  city: string;
  logo: string | null;
  latitude: number;
  longitude: number;
};

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUniversities() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/universities");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load universities."
          );
        }

        setUniversities(data);
      } catch (error) {
        console.error("Failed to load universities:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong while loading universities."
        );
      } finally {
        setLoading(false);
      }
    }

    loadUniversities();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Header */}
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-900">
            Education
          </p>

          <h1 className="text-4xl font-bold text-slate-900">
            Universities
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Explore universities and find student accommodation
            nearby.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-slate-600">
              Loading universities...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          universities.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                🎓
              </div>

              <h2 className="text-xl font-semibold text-slate-900">
                No universities yet
              </h2>

              <p className="mt-2 text-slate-600">
                Universities will appear here once they have
                been added.
              </p>
            </div>
          )}

        {/* Universities */}
        {!loading &&
          !error &&
          universities.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {universities.map((university) => (
                <article
                  key={university.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* University Logo */}
                  <div className="flex h-48 items-center justify-center bg-slate-50 p-8">
                    {university.logo ? (
                      <Image
                        src={university.logo}
                        alt={`${university.name} logo`}
                        width={140}
                        height={140}
                        className="h-32 w-32 object-contain"
                      />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 text-5xl">
                        🎓
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-sm font-medium text-blue-900">
                      {university.city}
                    </p>

                    <h2 className="mt-2 min-h-[56px] text-xl font-semibold leading-7 text-slate-900">
                      {university.name}
                    </h2>

                    <Link
                      href={`/browse?university=${encodeURIComponent(
                        university.id
                      )}`}
                      className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
                    >
                      View Accommodation
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
      </div>
    </main>
  );
}