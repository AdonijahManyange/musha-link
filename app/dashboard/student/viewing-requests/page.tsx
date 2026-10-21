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
  ArrowRight,
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
// STATUS STYLES
// ============================================================

function getStatusStyles(status: ViewingStatus) {
  switch (status) {
    case "ACCEPTED":
      return {
        label: "Accepted",
        badge:
          "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30",
        icon: CheckCircle2,
      };

    case "DECLINED":
      return {
        label: "Declined",
        badge:
          "bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/15 dark:text-red-300 dark:ring-red-500/30",
        icon: XCircle,
      };

    default:
      return {
        label: "Pending",
        badge:
          "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30",
        icon: Clock3,
      };
  }
}

// ============================================================
// FORMAT HELPERS
// ============================================================

function formatDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Harare",
  }).format(date);
}

function formatTime(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Time unavailable";
  }

  return date.toLocaleTimeString("en-GB", {
    timeZone: "Africa/Harare",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
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

function formatRoomType(value: string) {
  if (!value) return "Not specified";

  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
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

  // ==========================================================
  // FETCH THE STUDENT'S VIEWING REQUESTS
  // ==========================================================

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
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in to view your requests.");
        }

        if (response.status === 403) {
          throw new Error(
            "This page is only available to student accounts."
          );
        }

        throw new Error(
          data?.error || "Unable to load your viewing requests."
        );
      }

      if (!Array.isArray(data?.viewingRequests)) {
        throw new Error(
          "The server returned an unexpected response."
        );
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

  // ==========================================================
  // FILTERS AND COUNTS
  // ==========================================================

  const filteredRequests = requests.filter(
    (request) => filter === "ALL" || request.status === filter
  );

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
    <main className="min-h-screen bg-background px-4 py-8 text-text-primary transition-colors duration-200 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* ======================================================
            BACK NAVIGATION
        ====================================================== */}

        <div className="mb-7">
          <Link
            href="/dashboard/student"
            className="group inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-primary shadow-sm transition duration-200 hover:border-brand-blue hover:bg-surface-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
          >
            <ArrowLeft
              size={17}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />

            Back to Student Dashboard
          </Link>
        </div>

        {/* ======================================================
            PAGE HEADER
        ====================================================== */}

        <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-blue dark:text-blue-400">
              Student Dashboard
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              My Viewing Requests
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
              Track your accommodation viewing requests and check whether
              landlords have responded.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void fetchRequests(true)}
            disabled={loading || refreshing}
            className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-primary shadow-sm transition hover:border-brand-blue hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw
              size={17}
              className={
                loading || refreshing ? "animate-spin" : ""
              }
            />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </section>

        {/* ======================================================
            SUMMARY CARDS
        ====================================================== */}

        <section
          aria-label="Viewing request summary"
          className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <SummaryCard
            label="Total requests"
            count={requests.length}
            icon={CalendarDays}
            color="blue"
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
            color="green"
          />

          <SummaryCard
            label="Declined"
            count={declinedCount}
            icon={XCircle}
            color="red"
          />
        </section>

        {/* ======================================================
            STATUS FILTERS
        ====================================================== */}

        <section className="mb-6" aria-label="Filter viewing requests">
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
                  aria-pressed={active}
                  onClick={() => setFilter(value)}
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold transition duration-200 ${
                    active
                      ? "bg-brand-blue text-white shadow-sm hover:bg-brand-blue-dark"
                      : "border border-border bg-surface text-text-secondary hover:border-brand-blue hover:bg-surface-secondary hover:text-text-primary"
                  }`}
                >
                  {label}

                  {value === "PENDING" && pendingCount > 0 && (
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300"
                      }`}
                    >
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* ======================================================
            ERROR MESSAGE
        ====================================================== */}

        {!loading && error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-900 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200"
          >
            <AlertCircle size={21} className="mt-0.5 shrink-0" />

            <div className="min-w-0 flex-1">
              <h2 className="font-semibold">
                Unable to load viewing requests
              </h2>

              <p className="mt-1 text-sm leading-6">
                {error}
              </p>

              <button
                type="button"
                onClick={() => void fetchRequests()}
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold transition hover:bg-red-100 dark:border-red-500/40 dark:hover:bg-red-500/10"
              >
                <RefreshCw size={15} />
                Try again
              </button>
            </div>
          </div>
        )}

        {/* ======================================================
            LOADING STATE
        ====================================================== */}

        {loading && (
          <div className="rounded-2xl border border-border bg-surface p-12 text-center shadow-sm">
            <RefreshCw
              size={30}
              className="mx-auto animate-spin text-brand-blue dark:text-blue-400"
            />

            <h2 className="mt-4 font-semibold text-text-primary">
              Loading your requests
            </h2>

            <p className="mt-2 text-sm text-text-muted">
              Please wait while we retrieve your viewing requests.
            </p>
          </div>
        )}

        {/* ======================================================
            REQUEST LIST
        ====================================================== */}

        {!loading && !error && (
          <>
            {filteredRequests.length === 0 ? (
              <div className="rounded-2xl border border-border bg-surface px-6 py-14 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-secondary text-text-muted">
                  <CalendarDays size={28} />
                </div>

                <h2 className="mt-5 text-xl font-bold text-text-primary">
                  {requests.length === 0
                    ? "No viewing requests yet"
                    : "No requests in this category"}
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
                  {requests.length === 0
                    ? "When you request a viewing for a property, your request and its status will appear here."
                    : "Try selecting another filter to see your other viewing requests."}
                </p>

                {requests.length === 0 && (
                  <Link
                    href="/browse"
                    className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-blue-dark"
                  >
                    Browse accommodation
                    <ArrowRight size={16} />
                  </Link>
                )}

                {requests.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setFilter("ALL")}
                    className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark"
                  >
                    View all requests
                    <ArrowRight size={16} />
                  </button>
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
                      className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand-blue/50 hover:shadow-lg"
                    >
                      <div className="p-5 sm:p-6">

                        {/* LISTING TITLE AND STATUS */}

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <h2 className="break-words text-xl font-bold text-text-primary">
                              {request.listing.title}
                            </h2>

                            <p className="mt-2 flex items-start gap-2 text-sm text-text-secondary">
                              <MapPin
                                size={16}
                                className="mt-0.5 shrink-0 text-text-muted"
                              />

                              <span>
                                {location || "Location unavailable"}
                              </span>
                            </p>
                          </div>

                          <span
                            className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${statusStyle.badge}`}
                          >
                            <StatusIcon size={15} />
                            {statusStyle.label}
                          </span>
                        </div>

                        {/* PROPERTY DETAILS */}

                        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                          <PropertyDetail
                            label="Monthly rent"
                            value={formatRent(request.listing.monthlyRent)}
                          />

                          <PropertyDetail
                            label="Room type"
                            value={formatRoomType(request.listing.roomType)}
                            icon={<Home size={16} />}
                          />

                          <PropertyDetail
                            label="Landlord"
                            value={
                              request.landlord?.name ||
                              "Property landlord"
                            }
                          />
                        </div>

                        {/* REQUESTED VIEWING DATE AND TIME */}

                        <div className="mt-5 rounded-xl border border-brand-blue/20 bg-surface-secondary p-4 sm:p-5">
                          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-text-primary">
                            <CalendarDays
                              size={17}
                              className="text-brand-blue dark:text-blue-400"
                            />
                            Requested viewing
                          </h3>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex items-start gap-3">
                              <CalendarDays
                                size={17}
                                className="mt-0.5 shrink-0 text-brand-blue dark:text-blue-400"
                              />

                              <div>
                                <p className="text-xs text-text-muted">
                                  Preferred date
                                </p>

                                <p className="mt-1 text-sm font-semibold text-text-primary">
                                  {formatDate(request.requestedAt)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <Clock
                                size={17}
                                className="mt-0.5 shrink-0 text-brand-blue dark:text-blue-400"
                              />

                              <div>
                                <p className="text-xs text-text-muted">
                                  Preferred time (Zimbabwe)
                                </p>

                                <p className="mt-1 text-sm font-semibold text-text-primary">
                                  {formatTime(request.requestedAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* STUDENT'S ORIGINAL NOTE */}

                        {request.note && (
                          <div className="mt-5 rounded-xl border border-border bg-surface-secondary p-4">
                            <h3 className="flex items-center gap-2 text-sm font-bold text-text-primary">
                              <MessageSquare
                                size={16}
                                className="text-text-muted"
                              />
                              Your message
                            </h3>

                            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-text-secondary">
                              {request.note}
                            </p>
                          </div>
                        )}

                        {/* LANDLORD RESPONSE */}

                        {request.landlordResponse && (
                          <div className="mt-5 rounded-xl border border-brand-blue/20 bg-surface-secondary p-4">
                            <h3 className="flex items-center gap-2 text-sm font-bold text-text-primary">
                              <MessageSquare
                                size={16}
                                className="text-brand-blue dark:text-blue-400"
                              />
                              Landlord&apos;s response
                            </h3>

                            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-text-secondary">
                              {request.landlordResponse}
                            </p>

                            {request.respondedAt && (
                              <p className="mt-3 text-xs text-text-muted">
                                Responded on {formatDate(request.respondedAt)}
                              </p>
                            )}
                          </div>
                        )}

                        {/* PENDING MESSAGE */}

                        {request.status === "PENDING" && (
                          <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
                            <Clock3
                              size={20}
                              className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-300"
                            />

                            <div>
                              <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                                Waiting for the landlord
                              </p>

                              <p className="mt-1 text-sm leading-5 text-amber-800 dark:text-amber-300">
                                Your request has been submitted. The landlord
                                has not responded yet.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* REQUEST METADATA */}

                        <div className="mt-5 border-t border-border pt-4">
                          <p className="text-xs text-text-muted">
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
// PROPERTY DETAIL
// ============================================================

function PropertyDetail({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface-secondary p-4 transition-colors duration-200">
      <p className="text-xs font-medium text-text-muted">
        {label}
      </p>

      <p className="mt-2 flex items-center gap-2 break-words text-sm font-semibold text-text-primary">
        {icon && (
          <span className="shrink-0 text-text-muted">
            {icon}
          </span>
        )}

        {value}
      </p>
    </div>
  );
}

// ============================================================
// SUMMARY CARD
// ============================================================

type SummaryCardProps = {
  label: string;
  count: number;
  icon: typeof CalendarDays;
  color: "blue" | "amber" | "green" | "red";
};

function SummaryCard({
  label,
  count,
  icon: Icon,
  color,
}: SummaryCardProps) {
  const colorStyles = {
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    green: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300",
    red: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  };

  return (
    <div className="group rounded-2xl border border-border bg-surface p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand-blue/50 hover:shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-text-muted">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-text-primary">
            {count}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colorStyles[color]}`}
        >
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}