"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  MapPin,
  Home,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock3,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";

// ============================================================
// TYPES
// ============================================================

type ViewingStatus = "PENDING" | "ACCEPTED" | "DECLINED";

type ViewingRequest = {
  id: string;
  requestedAt: string;
  note: string | null;
  status: ViewingStatus;
  landlordResponse: string | null;
  respondedAt: string | null;
  createdAt: string;
  listing: {
    id: string;
    title: string;
    city: string;
    province: string;
    country: string;
    monthlyRent: number | string;
    roomType: string;
  };
  landlord: {
    name: string | null;
  };
};

type FilterStatus = "ALL" | ViewingStatus;

// ============================================================
// HELPERS
// ============================================================

function formatDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Time unavailable";
  }

  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatRent(rent: number | string) {
  const amount = Number(rent);

  if (!Number.isFinite(amount)) {
    return "Rent unavailable";
  }

  return amount.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
}

function formatStatus(status: ViewingStatus) {
  switch (status) {
    case "ACCEPTED":
      return "Accepted";
    case "DECLINED":
      return "Declined";
    default:
      return "Pending";
  }
}

function getStatusStyles(status: ViewingStatus) {
  switch (status) {
    case "ACCEPTED":
      return {
        badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        icon: CheckCircle2,
      };

    case "DECLINED":
      return {
        badge: "bg-red-50 text-red-700 ring-red-200",
        icon: XCircle,
      };

    default:
      return {
        badge: "bg-amber-50 text-amber-700 ring-amber-200",
        icon: Clock3,
      };
  }
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function StudentViewingRequestsPage() {
  const [requests, setRequests] = useState<ViewingRequest[]>([]);
  const [filter, setFilter] = useState<FilterStatus>("ALL");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ----------------------------------------------------------
  // Fetch the student's viewing requests
  // ----------------------------------------------------------

  const fetchRequests = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await fetch("/api/viewing-requests/student", {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to load your viewing requests."
        );
      }

      if (!Array.isArray(data?.viewingRequests)) {
        throw new Error("The server returned an unexpected response.");
      }

      setRequests(data.viewingRequests);
    } catch (err) {
      console.error("Failed to load viewing requests:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading your requests."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchRequests();
  }, [fetchRequests]);

  // ----------------------------------------------------------
  // Filter requests
  // ----------------------------------------------------------

  const filteredRequests = requests.filter((request) => {
    return filter === "ALL" || request.status === filter;
  });

  const pendingCount = requests.filter(
    (request) => request.status === "PENDING"
  ).length;

  const acceptedCount = requests.filter(
    (request) => request.status === "ACCEPTED"
  ).length;

  const declinedCount = requests.filter(
    (request) => request.status === "DECLINED"
  ).length;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <Link
          href="/dashboard/student"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        {/* Page header */}
        <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Student dashboard
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              My Viewing Requests
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Track your accommodation viewing requests and check whether
              landlords have responded.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void fetchRequests(true)}
            disabled={loading || refreshing}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </section>

        {/* Summary cards */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Total requests"
            count={requests.length}
            icon={CalendarDays}
            color="indigo"
          />

          <SummaryCard
            label="Awaiting response"
            count={pendingCount}
            icon={Clock3}
            color="amber"
          />

          <SummaryCard
            label="Accepted"
            count={acceptedCount}
            icon={CheckCircle2}
            color="emerald"
          />

          <SummaryCard
            label="Declined"
            count={declinedCount}
            icon={XCircle}
            color="red"
          />
        </section>

        {/* Filters */}
        <section className="mb-6">
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["ALL", "All requests"],
                ["PENDING", "Pending"],
                ["ACCEPTED", "Accepted"],
                ["DECLINED", "Declined"],
              ] as const
            ).map(([value, label]) => {
              const active = filter === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-slate-950 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Loading state */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <RefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin text-indigo-600" />

            <h2 className="font-semibold text-slate-900">
              Loading your requests
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Please wait while we retrieve your viewing requests.
            </p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-6"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

              <div className="flex-1">
                <h2 className="font-semibold text-red-900">
                  Unable to load viewing requests
                </h2>

                <p className="mt-1 text-sm leading-6 text-red-800">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => void fetchRequests()}
                  className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Request list */}
        {!loading && !error && (
          <>
            {filteredRequests.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                  <CalendarDays className="h-7 w-7 text-slate-500" />
                </div>

                <h2 className="text-lg font-bold text-slate-950">
                  {requests.length === 0
                    ? "No viewing requests yet"
                    : "No requests in this category"}
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                  {requests.length === 0
                    ? "When you schedule a viewing for a property, your request and its status will appear here."
                    : "Try selecting another filter to see your other viewing requests."}
                </p>

                {requests.length === 0 && (
                  <Link
                    href="/browse"
                    className="mt-6 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    Browse accommodation
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-5">
                {filteredRequests.map((request) => {
                  const statusStyle = getStatusStyles(request.status);
                  const StatusIcon = statusStyle.icon;

                  const location = [
                    request.listing.city,
                    request.listing.province,
                    request.listing.country,
                  ]
                    .filter(Boolean)
                    .join(", ");

                  return (
                    <article
                      key={request.id}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                    >
                      <div className="p-5 sm:p-6">
                        {/* Listing title and status */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <h2 className="break-words text-xl font-bold text-slate-950">
                              {request.listing.title}
                            </h2>

                            <p className="mt-2 flex items-start gap-2 text-sm text-slate-600">
                              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                              <span>
                                {location || "Location unavailable"}
                              </span>
                            </p>
                          </div>

                          <span
                            className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${statusStyle.badge}`}
                          >
                            <StatusIcon className="h-4 w-4" />
                            {formatStatus(request.status)}
                          </span>
                        </div>

                        {/* Property details */}
                        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                          <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs font-medium text-slate-500">
                              Monthly rent
                            </p>

                            <p className="mt-1 font-bold text-slate-950">
                              {formatRent(request.listing.monthlyRent)}
                            </p>
                          </div>

                          <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs font-medium text-slate-500">
                              Room type
                            </p>

                            <p className="mt-1 flex items-center gap-2 font-semibold text-slate-950">
                              <Home className="h-4 w-4 text-slate-400" />
                              {request.listing.roomType || "Not specified"}
                            </p>
                          </div>

                          <div className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xs font-medium text-slate-500">
                              Landlord
                            </p>

                            <p className="mt-1 font-semibold text-slate-950">
                              {request.landlord.name || "Property landlord"}
                            </p>
                          </div>
                        </div>

                        {/* Requested viewing date and time */}
                        <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
                          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
                            <CalendarDays className="h-4 w-4 text-indigo-600" />
                            Requested viewing
                          </h3>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="flex items-start gap-3">
                              <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />

                              <div>
                                <p className="text-xs text-slate-500">
                                  Preferred date
                                </p>

                                <p className="mt-1 text-sm font-semibold text-slate-900">
                                  {formatDate(request.requestedAt)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />

                              <div>
                                <p className="text-xs text-slate-500">
                                  Preferred time
                                </p>

                                <p className="mt-1 text-sm font-semibold text-slate-900">
                                  {formatTime(request.requestedAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Student's original note */}
                        {request.note && (
                          <div className="mt-5">
                            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                              <MessageSquare className="h-4 w-4 text-slate-500" />
                              Your message
                            </h3>

                            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                              {request.note}
                            </p>
                          </div>
                        )}

                        {/* Landlord response */}
                        {request.landlordResponse && (
                          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                              <MessageSquare className="h-4 w-4 text-slate-500" />
                              Landlord&apos;s response
                            </h3>

                            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                              {request.landlordResponse}
                            </p>

                            {request.respondedAt && (
                              <p className="mt-3 text-xs text-slate-500">
                                Responded on {formatDate(request.respondedAt)}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Pending message */}
                        {request.status === "PENDING" && (
                          <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                            <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                            <div>
                              <p className="text-sm font-semibold text-amber-900">
                                Waiting for the landlord
                              </p>

                              <p className="mt-1 text-sm leading-5 text-amber-800">
                                Your request has been submitted. The landlord
                                has not responded yet.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Request metadata */}
                        <div className="mt-5 border-t border-slate-100 pt-4">
                          <p className="text-xs text-slate-400">
                            Request submitted {formatDate(request.createdAt)}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

// ============================================================
// SUMMARY CARD
// ============================================================

type SummaryCardProps = {
  label: string;
  count: number;
  icon: typeof CalendarDays;
  color: "indigo" | "amber" | "emerald" | "red";
};

function SummaryCard({
  label,
  count,
  icon: Icon,
  color,
}: SummaryCardProps) {
  const colorStyles = {
    indigo: "bg-indigo-50 text-indigo-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {count}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${colorStyles[color]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}