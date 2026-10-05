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

  const isToday =
    date.toDateString() === now.toDateString();

  if (isToday) {
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
  // Current user is the student.
  // The other person is the landlord.
  if (conversation.studentId === currentUserId) {
    return (
      conversation.landlord.landlordProfile
        ?.profilePhotoUrl ?? null
    );
  }

  // Current user is the landlord.
  // The other person is the student.
  return (
    conversation.student.studentProfile
      ?.profilePhotoUrl ?? null
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

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // ==========================================================
  // LOAD CURRENT USER
  // ==========================================================

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch(
          "/api/auth/session",
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Unable to load your session."
          );
        }

        const data = await response.json();

        const user = data?.user;

        if (!user?.id) {
          setError(
            "You must be logged in to view your messages."
          );
          return;
        }

        setCurrentUserId(user.id);
      } catch (error) {
        console.error(
          "Failed to load session:",
          error
        );

        setError(
          "Unable to load your account."
        );
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
            data?.error ??
              "Unable to load conversations."
          );
        }

        setConversations(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load conversations:",
          error
        );

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
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-8 w-40 animate-pulse rounded-lg bg-gray-200" />

            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex animate-pulse gap-4 border-b border-gray-100 p-5 last:border-b-0"
              >
                <div className="h-14 w-14 shrink-0 rounded-full bg-gray-200" />

                <div className="flex-1">
                  <div className="h-4 w-40 rounded bg-gray-200" />

                  <div className="mt-2 h-3 w-56 rounded bg-gray-200" />

                  <div className="mt-2 h-3 w-32 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              !
            </div>

            <h1 className="mt-4 text-xl font-semibold text-gray-900">
              Unable to load messages
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-6 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
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
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Messages
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Your conversations with students and
              landlords will appear here.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-7 w-7 text-gray-500"
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

            <h2 className="mt-5 text-lg font-semibold text-gray-900">
              No conversations yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              When you contact a landlord or receive
              a message about a listing, your
              conversation will appear here.
            </p>

            <Link
              href="/browse"
              className="mt-6 inline-flex rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
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
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ----------------------------------------------------
            HEADER
        ---------------------------------------------------- */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Messages
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Keep track of your conversations about
            student housing.
          </p>
        </div>

        {/* ----------------------------------------------------
            CONVERSATIONS
        ---------------------------------------------------- */}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {conversations.map(
            (conversation) => {
              const otherPerson =
                getConversationName(
                  conversation,
                  currentUserId ?? ""
                );

              const photo =
                getConversationPhoto(
                  conversation,
                  currentUserId ?? ""
                );

              const latestMessage =
                conversation.latestMessage;

              return (
                <Link
                  key={conversation.id}
                  href={`/messages/${conversation.id}`}
                  className="group flex gap-4 border-b border-gray-100 p-5 transition hover:bg-gray-50 last:border-b-0"
                >
                  {/* ------------------------------------------
                      PROFILE PHOTO
                  ------------------------------------------ */}

                  <div className="relative shrink-0">
                    {photo ? (
                      <img
                        src={photo}
                        alt={otherPerson}
                        className="h-14 w-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-lg font-semibold text-white">
                        {otherPerson
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    {conversation.unreadCount >
                      0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                        {conversation.unreadCount >
                        99
                          ? "99+"
                          : conversation.unreadCount}
                      </span>
                    )}
                  </div>

                  {/* ------------------------------------------
                      CONTENT
                  ------------------------------------------ */}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2
                          className={`truncate text-sm font-semibold ${
                            conversation.unreadCount >
                            0
                              ? "text-gray-950"
                              : "text-gray-800"
                          }`}
                        >
                          {otherPerson}
                        </h2>

                        <p className="mt-0.5 truncate text-xs text-gray-500">
                          {conversation.listing
                            .title}
                        </p>
                      </div>

                      {latestMessage && (
                        <span className="shrink-0 text-xs text-gray-400">
                          {formatMessageTime(
                            latestMessage.createdAt
                          )}
                        </span>
                      )}
                    </div>

                    <div className="mt-1 flex items-center gap-2">
                      <span className="truncate text-xs text-gray-500">
                        {conversation.listing
                          .suburb
                          ? `${conversation.listing.suburb}, `
                          : ""}
                        {
                          conversation.listing
                            .city
                        }
                        ,{" "}
                        {
                          conversation.listing
                            .province
                        }
                      </span>
                    </div>

                    {latestMessage ? (
                      <p
                        className={`mt-2 truncate text-sm ${
                          conversation.unreadCount >
                          0
                            ? "font-medium text-gray-900"
                            : "text-gray-500"
                        }`}
                      >
                        {latestMessage.senderId ===
                        currentUserId
                          ? "You: "
                          : ""}
                        {latestMessage.content}
                      </p>
                    ) : (
                      <p className="mt-2 text-sm italic text-gray-400">
                        No messages yet
                      </p>
                    )}
                  </div>

                  {/* ------------------------------------------
                      ARROW
                  ------------------------------------------ */}

                  <div className="hidden shrink-0 items-center sm:flex">
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      className="h-5 w-5 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-gray-500"
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
            }
          )}
        </div>
      </div>
    </main>
  );
}