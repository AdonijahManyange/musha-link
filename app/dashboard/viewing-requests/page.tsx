"use client";

import { useCallback, useEffect, useState } from "react";

import {
  CalendarDays,
  Clock,
  MapPin,
  Phone,
  Mail,
  UserRound,
  CheckCircle2,
  XCircle,
  Clock3,
  RefreshCw,
  AlertCircle,
  MessageSquare,
} from "lucide-react";

// ============================================================
// TYPES
// ============================================================

type ViewingStatus =
  | "PENDING"
  | "ACCEPTED"
  | "DECLINED"
  | "CANCELLED"
  | "COMPLETED";

type ViewingRequest = {
  id: string;
  studentId: string;
  studentName: string;
  studentPhone: string;
  studentEmail: string;
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
    monthlyRent: number;
    roomType: string;
  };
};

type StatusFilter = "ALL" | ViewingStatus;

// ============================================================
// STATUS CONFIGURATION
// ============================================================

const STATUS_STYLES: Record<
  ViewingStatus,
  {
    label: string;
    className: string;
  }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-100 text-amber-800",
  },
  ACCEPTED: {
    label: "Accepted",
    className: "bg-green-100 text-green-800",
  },
  DECLINED: {
    label: "Declined",
    className: "bg-red-100 text-red-800",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-slate-100 text-slate-700",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-blue-100 text-blue-800",
  },
};

const FILTERS: {
  label: string;
  value: StatusFilter;
}[] = [
  { label: "All Requests", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Declined", value: "DECLINED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

// ============================================================
// PAGE
// ============================================================

export default function ViewingRequestsPage() {
  const [requests, setRequests] = useState<ViewingRequest[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("ALL");

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [updatingRequestId, setUpdatingRequestId] = useState<
    string | null
  >(null);

  // Store each request's optional message separately.
  const [responses, setResponses] = useState<Record<string, string>>(
    {}
  );

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // ==========================================================
  // LOAD VIEWING REQUESTS
  // ==========================================================

  const loadRequests = useCallback(async (background = false) => {
    if (background) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setError("");

    try {
      const response = await fetch("/api/viewing-requests/landlord", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Please sign in to view your viewing requests."
          );
        }

        if (response.status === 403) {
          throw new Error(
            "This page is only available to landlord accounts."
          );
        }

        throw new Error(
          data?.error || "Unable to load viewing requests."
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
          : "Something went wrong while loading requests."
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  // ==========================================================
  // UPDATE A LANDLORD'S OPTIONAL RESPONSE
  // ==========================================================

  function updateResponse(requestId: string, value: string) {
    setResponses((previous) => ({
      ...previous,
      [requestId]: value,
    }));
  }

  // ==========================================================
  // ACCEPT OR DECLINE A REQUEST
  // ==========================================================

  async function respondToRequest(
    requestId: string,
    status: "ACCEPTED" | "DECLINED"
  ) {
    const confirmation =
      status === "ACCEPTED"
        ? "Accept this viewing request?"
        : "Decline this viewing request?";

    if (!window.confirm(confirmation)) {
      return;
    }

    const landlordResponse = (
      responses[requestId] ?? ""
    ).trim();

    setUpdatingRequestId(requestId);
    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `/api/viewing-requests/${encodeURIComponent(requestId)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            landlordResponse,
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to update this viewing request."
        );
      }

      setNotice(
        data?.message ||
          (status === "ACCEPTED"
            ? "Viewing request accepted successfully."
            : "Viewing request declined successfully.")
      );

      // Clear the message field after a successful response.
      setResponses((previous) => {
        const next = { ...previous };
        delete next[requestId];
        return next;
      });

      // Refresh the data without replacing the whole page
      // with the initial loading screen.
      await loadRequests(true);
    } catch (err) {
      console.error("Failed to respond to viewing request:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while updating the request."
      );
    } finally {
      setUpdatingRequestId(null);
    }
  }

  // ==========================================================
  // FORMAT HELPERS
  // ==========================================================

  function formatDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Invalid date";
    }

    return new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }

  function formatTime(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Invalid time";
    }

    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }

  function formatRoomType(value: string) {
    return value
      .toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (character) => character.toUpperCase());
  }

  function formatRent(value: number) {
    return new Intl.NumberFormat().format(value);
  }

  // ==========================================================
  // FILTERED REQUESTS AND COUNTS
  // ==========================================================

  const filteredRequests =
    filter === "ALL"
      ? requests
      : requests.filter((request) => request.status === filter);

  const pendingCount = requests.filter(
    (request) => request.status === "PENDING"
  ).length;

  const acceptedCount = requests.filter(
    (request) => request.status === "ACCEPTED"
  ).length;

  const completedCount = requests.filter(
    (request) => request.status === "COMPLETED"
  ).length;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
              Landlord Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Viewing Requests
            </h1>

            <p className="mt-2 max-w-2xl text-slate-600">
              Review students&apos; requests to visit your properties
              and keep track of upcoming viewings.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadRequests(true)}
            disabled={isLoading || isRefreshing}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw
              size={17}
              className={
                isLoading || isRefreshing ? "animate-spin" : ""
              }
            />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Summary Cards */}
        <section
          aria-label="Viewing request summary"
          className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <SummaryCard
            label="Pending Requests"
            value={pendingCount}
            description="Awaiting your response"
            icon={<Clock3 size={22} />}
            iconClassName="bg-amber-100 text-amber-700"
          />

          <SummaryCard
            label="Accepted Requests"
            value={acceptedCount}
            description="Viewings to arrange"
            icon={<CheckCircle2 size={22} />}
            iconClassName="bg-green-100 text-green-700"
          />

          <SummaryCard
            label="Completed Viewings"
            value={completedCount}
            description="Successfully completed"
            icon={<CalendarDays size={22} />}
            iconClassName="bg-blue-100 text-blue-700"
          />
        </section>

        {/* Success Message */}
        {notice && (
          <div
            role="status"
            className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
          >
            {notice}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            <AlertCircle size={20} className="shrink-0" />

            <div className="flex-1">{error}</div>

            <button
              type="button"
              onClick={() => void loadRequests(true)}
              className="font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Status Filters */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex min-w-max gap-2">
            {FILTERS.map((item) => {
              const isActive = filter === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-blue-900 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {item.label}

                  {item.value === "PENDING" &&
                    pendingCount > 0 && (
                      <span
                        className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {pendingCount}
                      </span>
                    )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Request List */}
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <RefreshCw
              size={28}
              className="mx-auto animate-spin text-blue-800"
            />

            <p className="mt-4 font-medium text-slate-700">
              Loading viewing requests...
            </p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <CalendarDays size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              {filter === "ALL"
                ? "No viewing requests yet"
                : `No ${filter.toLowerCase()} requests`}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              {filter === "ALL"
                ? "When students request to visit one of your properties, their requests will appear here."
                : "There are currently no requests in this category."}
            </p>

            {filter !== "ALL" && (
              <button
                type="button"
                onClick={() => setFilter("ALL")}
                className="mt-5 rounded-xl bg-blue-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                View All Requests
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {filteredRequests.map((request) => {
              const status = STATUS_STYLES[request.status];

              const isUpdating =
                updatingRequestId === request.id;

              const isAnyRequestUpdating =
                updatingRequestId !== null;

              return (
                <article
                  key={request.id}
                  id={`viewing-request-${request.id}`}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* Request Header */}
                  <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-start sm:px-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${status.className}`}
                        >
                          {status.label}
                        </span>

                        <span className="text-xs text-slate-500">
                          Submitted {formatDate(request.createdAt)}
                        </span>
                      </div>

                      <h2 className="mt-3 text-xl font-bold text-slate-900">
                        {request.listing.title}
                      </h2>

                      <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                        <MapPin size={15} className="shrink-0" />

                        {[
                          request.listing.city,
                          request.listing.province,
                          request.listing.country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-lg font-bold text-slate-900">
                        {formatRent(request.listing.monthlyRent)}
                      </p>

                      <p className="text-xs text-slate-500">
                        Monthly rent
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        {formatRoomType(request.listing.roomType)}
                      </p>
                    </div>
                  </div>

                  {/* Request Details */}
                  <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
                    {/* Student Information */}
                    <section>
                      <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
                        <UserRound
                          size={18}
                          className="text-blue-800"
                        />
                        Student Information
                      </h3>

                      <p className="text-lg font-semibold text-slate-900">
                        {request.studentName || "Student"}
                      </p>

                      <div className="mt-3 space-y-3">
                        {request.studentPhone ? (
                          <a
                            href={`tel:${request.studentPhone}`}
                            className="flex items-center gap-2 break-all text-sm text-slate-600 transition hover:text-blue-800"
                          >
                            <Phone size={16} className="shrink-0" />
                            {request.studentPhone}
                          </a>
                        ) : (
                          <p className="text-sm text-slate-500">
                            No phone number provided.
                          </p>
                        )}

                        {request.studentEmail ? (
                          <a
                            href={`mailto:${request.studentEmail}`}
                            className="flex items-center gap-2 break-all text-sm text-slate-600 transition hover:text-blue-800"
                          >
                            <Mail size={16} className="shrink-0" />
                            {request.studentEmail}
                          </a>
                        ) : (
                          <p className="text-sm text-slate-500">
                            No email address available.
                          </p>
                        )}
                      </div>
                    </section>

                    {/* Preferred Viewing */}
                    <section>
                      <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
                        <CalendarDays
                          size={18}
                          className="text-blue-800"
                        />
                        Preferred Viewing
                      </h3>

                      <div className="space-y-3">
                        <p className="flex items-center gap-2 text-sm text-slate-700">
                          <CalendarDays
                            size={16}
                            className="shrink-0 text-slate-400"
                          />
                          {formatDate(request.requestedAt)}
                        </p>

                        <p className="flex items-center gap-2 text-sm text-slate-700">
                          <Clock
                            size={16}
                            className="shrink-0 text-slate-400"
                          />
                          {formatTime(request.requestedAt)}
                        </p>
                      </div>
                    </section>
                  </div>

                  {/* Student Note */}
                  {request.note && (
                    <div className="mx-5 mb-5 rounded-xl bg-slate-50 p-4 sm:mx-6">
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                        <MessageSquare size={16} />
                        Student&apos;s Note
                      </h3>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                        {request.note}
                      </p>
                    </div>
                  )}

                  {/* Landlord Response */}
                  {request.landlordResponse && (
                    <div className="mx-5 mb-5 rounded-xl border border-blue-100 bg-blue-50 p-4 sm:mx-6">
                      <h3 className="text-sm font-semibold text-blue-900">
                        Your Response
                      </h3>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-blue-800">
                        {request.landlordResponse}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 sm:px-6">
                    {request.status === "PENDING" ? (
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor={`landlord-response-${request.id}`}
                            className="mb-2 block text-sm font-semibold text-slate-800"
                          >
                            Your response{" "}
                            <span className="font-normal text-slate-500">
                              (optional)
                            </span>
                          </label>

                          <textarea
                            id={`landlord-response-${request.id}`}
                            value={responses[request.id] ?? ""}
                            onChange={(event) =>
                              updateResponse(
                                request.id,
                                event.target.value
                              )
                            }
                            maxLength={1000}
                            rows={3}
                            disabled={isAnyRequestUpdating}
                            placeholder="For example: The property is available. Please contact me before arriving..."
                            className="w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                          />

                          <p className="mt-1 text-right text-xs text-slate-500">
                            {(responses[request.id] ?? "").length}/1000
                            characters
                          </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-sm text-slate-600">
                            This request is awaiting your response.
                          </p>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                void respondToRequest(
                                  request.id,
                                  "ACCEPTED"
                                )
                              }
                              disabled={isAnyRequestUpdating}
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isUpdating ? (
                                <RefreshCw
                                  size={16}
                                  className="animate-spin"
                                />
                              ) : (
                                <CheckCircle2 size={16} />
                              )}

                              {isUpdating ? "Processing..." : "Accept"}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                void respondToRequest(
                                  request.id,
                                  "DECLINED"
                                )
                              }
                              disabled={isAnyRequestUpdating}
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isUpdating ? (
                                <RefreshCw
                                  size={16}
                                  className="animate-spin"
                                />
                              ) : (
                                <XCircle size={16} />
                              )}

                              {isUpdating
                                ? "Processing..."
                                : "Decline"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-600">
                        {request.status === "ACCEPTED"
                          ? "This viewing request has been accepted."
                          : request.status === "DECLINED"
                            ? "This viewing request has been declined."
                            : request.status === "CANCELLED"
                              ? "This viewing request has been cancelled."
                              : "This viewing has been marked as completed."}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

// ============================================================
// SUMMARY CARD
// ============================================================

function SummaryCard({
  label,
  value,
  description,
  icon,
  iconClassName,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  iconClassName: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClassName}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}