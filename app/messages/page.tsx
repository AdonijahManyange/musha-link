"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// ============================================================
// TYPES
// ============================================================

type Photo = {
  id: string;
  url: string;
  fileName: string;
  sortOrder: number;
  isCover: boolean;
};

type Listing = {
  id: string;
  title: string;
  city: string;
  province: string;
  suburb: string | null;
  photos: Photo[];
};

type StudentProfile = {
  profilePhotoUrl: string | null;
};

type Person = {
  id: string;
  name: string | null;
  email: string;
};

type Student = Person & {
  studentProfile: StudentProfile | null;
};

type LandlordProfile = {
  phone: string | null;
  profilePhotoUrl: string | null;
};

type Landlord = Person & {
  landlordProfile: LandlordProfile | null;
};

type Message = {
  id: string;
  content: string;
  senderId: string;
  recipientId: string;
  read: boolean;
  createdAt: string;
};

type Conversation = {
  id: string;
  studentId: string;
  landlordId: string;
  listingId: string;
  createdAt: string;
  updatedAt: string;

  listing: Listing;
  student: Student;
  landlord: Landlord;

  messages: Message[];
  latestMessage: Message | null;
  unreadCount: number;
};

// ============================================================
// HELPERS
// ============================================================

function formatMessageTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

function getConversationName(
  conversation: Conversation,
  currentUserId: string
) {
  if (conversation.studentId === currentUserId) {
    return (
      conversation.landlord.name ??
      conversation.landlord.email
    );
  }

  return (
    conversation.student.name ??
    conversation.student.email
  );
}

function getConversationPhoto(
  conversation: Conversation,
  currentUserId: string
) {
  if (conversation.studentId === currentUserId) {
    return (
      conversation.landlord.landlordProfile
        ?.profilePhotoUrl ?? null
    );
  }

  return (
    conversation.student.studentProfile
      ?.profilePhotoUrl ?? null
  );
}

// ============================================================
// REUSABLE LOADING SKELETON
// ============================================================

function MessagesLoading() {
  return (
    <main className="min-h-screen bg-surface px-4 py-8 text-text-primary transition-colors sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-surface-secondary" />
          <div className="mt-3 h-4 w-64 max-w-full animate-pulse rounded bg-surface-secondary" />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="flex animate-pulse gap-4 border-b border-border p-5 last:border-b-0"
            >
              <div className="h-14 w-14 shrink-0 rounded-full bg-surface-secondary" />

              <div className="flex-1">
                <div className="h-4 w-40 rounded bg-surface-secondary" />
                <div className="mt-3 h-3 w-56 max-w-full rounded bg-surface-secondary" />
                <div className="mt-3 h-3 w-32 rounded bg-surface-secondary" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

// ============================================================
// PAGE
// ============================================================

export default function MessagesPage() {
  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [currentUserId, setCurrentUserId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  // ==========================================================
  // LOAD CURRENT USER
  // ==========================================================

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/session", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Unable to load your session.");
        }

        const data = await response.json();
        const user = data?.user;

        if (!user?.id) {
          setError(
            "You must be logged in to view your messages."
          );
          setLoading(false);
          return;
        }

        setCurrentUserId(user.id);
      } catch (error) {
        console.error("Failed to load session:", error);

        setError("Unable to load your account.");
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  // ==========================================================
  // LOAD CONVERSATIONS
  // ==========================================================

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    async function loadConversations() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "/api/messages/conversations",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ?? "Unable to load conversations."
          );
        }

        setConversations(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error("Failed to load conversations:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load conversations."
        );
      } finally {
        setLoading(false);
      }
    }

    loadConversations();
  }, [currentUserId]);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return <MessagesLoading />;
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <main className="min-h-screen bg-surface px-4 py-12 text-text-primary transition-colors sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-red-500/30 bg-surface p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-2xl font-bold text-red-500">
              !
            </div>

            <h1 className="mt-4 text-xl font-semibold text-text-primary">
              Unable to load messages
            </h1>

            <p className="mt-2 text-sm leading-6 text-text-secondary">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
            >
              Try again
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================================
  // EMPTY STATE
  // ==========================================================

  if (conversations.length === 0) {
    return (
      <main className="min-h-screen bg-surface px-4 py-8 text-text-primary transition-colors sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">
              Messages
            </h1>

            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Your conversations with students and landlords
              will appear here.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-8 text-center shadow-sm sm:px-6 sm:py-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-secondary">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-7 w-7 text-text-secondary"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10h8M8 14h5"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 4H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z"
                />
              </svg>
            </div>

            <h2 className="mt-5 text-lg font-semibold text-text-primary">
              No conversations yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
              When you contact a landlord or receive a message
              about a listing, your conversation will appear here.
            </p>

            <Link
              href="/browse"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
            >
              Browse Listings
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================================
  // CONVERSATION LIST
  // ==========================================================

  return (
    <main className="min-h-screen bg-surface px-4 py-8 text-text-primary transition-colors sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            Messages
          </h1>

          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Keep track of your conversations about student housing.
          </p>
        </div>

        {/* CONVERSATIONS */}

        <div className="space-y-3">
          {conversations.map((conversation) => {
            const otherPerson = getConversationName(
              conversation,
              currentUserId ?? ""
            );

            const photo = getConversationPhoto(
              conversation,
              currentUserId ?? ""
            );

            const latestMessage = conversation.latestMessage;
            const hasUnread = conversation.unreadCount > 0;

            return (
              <Link
                key={conversation.id}
                href={`/messages/${conversation.id}`}
                className={[
                  "group relative flex gap-4 overflow-hidden rounded-2xl border p-4 shadow-sm",
                  "transition-all duration-200 ease-out",
                  "hover:-translate-y-0.5 hover:shadow-lg",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2",
                  "sm:gap-5 sm:p-5",
                  hasUnread
                    ? "border-brand-blue/40 bg-surface-secondary/70 hover:border-brand-blue hover:bg-surface-secondary"
                    : "border-border bg-surface hover:border-brand-blue/50 hover:bg-surface-secondary",
                ].join(" ")}
              >
                {/* A subtle blue accent appears on hover. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 origin-left scale-y-0 bg-brand-blue transition-transform duration-200 group-hover:scale-y-100"
                />

                {/* PROFILE PHOTO */}

                <div className="relative ml-1 shrink-0 self-start">
                  {photo ? (
                    <img
                      src={photo}
                      alt={otherPerson}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-border sm:h-14 sm:w-14"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue text-lg font-semibold text-white ring-2 ring-border sm:h-14 sm:w-14">
                      {otherPerson.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {hasUnread && (
                    <span
                      aria-label={`${conversation.unreadCount} unread messages`}
                      className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-surface"
                    >
                      {conversation.unreadCount > 99
                        ? "99+"
                        : conversation.unreadCount}
                    </span>
                  )}
                </div>

                {/* CONVERSATION DETAILS */}

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h2
                        className={`truncate text-sm ${
                          hasUnread
                            ? "font-bold text-text-primary"
                            : "font-semibold text-text-primary"
                        }`}
                      >
                        {otherPerson}
                      </h2>

                      <p className="mt-1 truncate text-xs text-text-secondary">
                        {conversation.listing.title}
                      </p>
                    </div>

                    {latestMessage && (
                      <time
                        dateTime={latestMessage.createdAt}
                        className="shrink-0 pt-0.5 text-xs text-text-muted"
                      >
                        {formatMessageTime(latestMessage.createdAt)}
                      </time>
                    )}
                  </div>

                  {/* PROPERTY LOCATION */}

                  <p className="mt-2 truncate text-xs text-text-secondary">
                    {conversation.listing.suburb
                      ? `${conversation.listing.suburb}, `
                      : ""}
                    {conversation.listing.city},{" "}
                    {conversation.listing.province}
                  </p>

                  {/* LATEST MESSAGE */}

                  {latestMessage ? (
                    <p
                      className={`mt-2 truncate text-sm ${
                        hasUnread
                          ? "font-medium text-text-primary"
                          : "text-text-secondary"
                      }`}
                    >
                      {latestMessage.senderId === currentUserId
                        ? "You: "
                        : ""}
                      {latestMessage.content}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm italic text-text-muted">
                      No messages yet
                    </p>
                  )}
                </div>

                {/* ARROW */}

                <div className="hidden shrink-0 items-center self-center sm:flex">
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                    className="h-5 w-5 text-text-muted transition-all duration-200 group-hover:translate-x-1 group-hover:text-brand-blue"
                  >
                    <path
                      d="M7 4l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}