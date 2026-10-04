"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

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

type Person = {
  id: string;
  name: string | null;
  email: string;
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
  conversationId: string;
  senderId: string;
  recipientId: string;
  content: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
};

type Conversation = {
  id: string;
  studentId: string;
  landlordId: string;
  listingId: string;
  createdAt: string;
  updatedAt: string;

  listing: Listing;
  student: Person;
  landlord: Landlord;

  messages: Message[];
};

// ============================================================
// HELPERS
// ============================================================

function formatMessageTime(
  dateString: string
) {
  const date = new Date(dateString);

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatMessageDate(
  dateString: string
) {
  const date = new Date(dateString);

  const now = new Date();

  if (
    date.toDateString() ===
    now.toDateString()
  ) {
    return "Today";
  }

  const yesterday = new Date(now);

  yesterday.setDate(
    yesterday.getDate() - 1
  );

  if (
    date.toDateString() ===
    yesterday.toDateString()
  ) {
    return "Yesterday";
  }

  return date.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
    year:
      date.getFullYear() !==
      now.getFullYear()
        ? "numeric"
        : undefined,
  });
}

// ============================================================
// PAGE
// ============================================================

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();

  const conversationId =
    typeof params.id === "string"
      ? params.id
      : null;

  const [conversation, setConversation] =
    useState<Conversation | null>(null);

  const [currentUserId, setCurrentUserId] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

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
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Unable to load your session."
          );
        }

        const data =
          await response.json();

        const user = data?.user;

        if (!user?.id) {
          router.push("/login");
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

        setLoading(false);
      }
    }

    loadUser();
  }, [router]);

  // ==========================================================
  // LOAD CONVERSATION
  // ==========================================================

  useEffect(() => {
    if (
      !conversationId ||
      !currentUserId
    ) {
      return;
    }

    async function loadConversation() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/messages/conversations/${conversationId}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ??
              "Unable to load conversation."
          );
        }

        setConversation(
          data?.conversation ?? null
        );
      } catch (error) {
        console.error(
          "Failed to load conversation:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load conversation."
        );
      } finally {
        setLoading(false);
      }
    }

    loadConversation();
  }, [
    conversationId,
    currentUserId,
  ]);

  // ==========================================================
  // SCROLL TO BOTTOM
  // ==========================================================

  useEffect(() => {
    if (!conversation) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [conversation]);

  // ==========================================================
  // SEND MESSAGE
  // ==========================================================

  async function handleSendMessage(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !conversationId ||
      !message.trim() ||
      sending
    ) {
      return;
    }

    const content = message.trim();

    try {
      setSending(true);
      setError(null);

      const response = await fetch(
        `/api/messages/conversations/${conversationId}`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            message: content,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ??
            "Unable to send message."
        );
      }

      const createdMessage =
        data?.message as Message | undefined;

      if (createdMessage) {
        setConversation((current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,

            messages: [
              ...current.messages,
              createdMessage,
            ],

            updatedAt:
              createdMessage.createdAt,
          };
        });
      }

      setMessage("");
    } catch (error) {
      console.error(
        "Failed to send message:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to send message."
      );
    } finally {
      setSending(false);
    }
  }

  // ==========================================================
  // LOADING STATE
  // ==========================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

            <p className="mt-4 text-sm text-gray-500">
              Loading conversation...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================================
  // ERROR STATE
  // ==========================================================

  if (error && !conversation) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              !
            </div>

            <h1 className="mt-4 text-xl font-semibold text-gray-900">
              Unable to load conversation
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              {error}
            </p>

            <Link
              href="/messages"
              className="mt-6 inline-flex rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Back to Messages
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!conversation || !currentUserId) {
    return null;
  }

  // ==========================================================
  // DETERMINE OTHER PERSON
  // ==========================================================

  const isStudent =
    conversation.studentId ===
    currentUserId;

  const otherPerson = isStudent
    ? conversation.landlord
    : conversation.student;

  const otherPersonName =
    otherPerson.name ??
    otherPerson.email;

  const profilePhoto =
    isStudent
      ? conversation.landlord
          .landlordProfile
          ?.profilePhotoUrl ?? null
      : null;

  const listingPhoto =
    conversation.listing.photos[0]?.url ??
    null;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto flex h-screen max-w-6xl flex-col px-0 sm:px-4 sm:py-4">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white sm:rounded-2xl sm:border sm:border-gray-200 sm:shadow-sm">
          {/* ==================================================
              HEADER
          ================================================== */}

          <header className="flex shrink-0 items-center gap-3 border-b border-gray-200 px-4 py-3 sm:px-5">
            {/* Back button */}

            <Link
              href="/messages"
              aria-label="Back to messages"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
              >
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            {/* Profile */}

            <div className="shrink-0">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt={otherPersonName}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                  {otherPersonName
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}
            </div>

            {/* Person + listing */}

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-sm font-semibold text-gray-900">
                {otherPersonName}
              </h1>

              <p className="truncate text-xs text-gray-500">
                {conversation.listing.title}
              </p>
            </div>

            {/* Listing */}

            <Link
              href={`/listings/${conversation.listing.id}`}
              className="hidden shrink-0 items-center gap-2 rounded-xl border border-gray-200 px-2 py-1.5 transition hover:bg-gray-50 sm:flex"
            >
              {listingPhoto && (
                <img
                  src={listingPhoto}
                  alt=""
                  className="h-8 w-8 rounded-lg object-cover"
                />
              )}

              <div className="max-w-40">
                <p className="truncate text-xs font-medium text-gray-800">
                  View listing
                </p>

                <p className="truncate text-[11px] text-gray-400">
                  {conversation.listing.city},{" "}
                  {conversation.listing.province}
                </p>
              </div>
            </Link>
          </header>

          {/* ==================================================
              LISTING INFO — MOBILE
          ================================================== */}

          <Link
            href={`/listings/${conversation.listing.id}`}
            className="flex shrink-0 items-center gap-3 border-b border-gray-100 bg-gray-50 px-4 py-3 sm:hidden"
          >
            {listingPhoto ? (
              <img
                src={listingPhoto}
                alt=""
                className="h-12 w-12 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-200">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5 text-gray-500"
                >
                  <path
                    d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-5h6v5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">
                {conversation.listing.title}
              </p>

              <p className="truncate text-xs text-gray-500">
                {conversation.listing.suburb
                  ? `${conversation.listing.suburb}, `
                  : ""}
                {conversation.listing.city},{" "}
                {conversation.listing.province}
              </p>
            </div>

            <span className="text-xs font-medium text-gray-600">
              View
            </span>
          </Link>

          {/* ==================================================
              MESSAGES
          ================================================== */}

          <div className="min-h-0 flex-1 overflow-y-auto bg-white px-4 py-6 sm:px-6">
            <div className="mx-auto max-w-3xl">
              {/* Conversation intro */}

              <div className="mb-8 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  {listingPhoto ? (
                    <img
                      src={listingPhoto}
                      alt=""
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-6 w-6 text-gray-500"
                    >
                      <path
                        d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-5h6v5"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>

                <p className="text-sm font-medium text-gray-800">
                  {conversation.listing.title}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {conversation.listing.suburb
                    ? `${conversation.listing.suburb}, `
                    : ""}
                  {conversation.listing.city},{" "}
                  {conversation.listing.province}
                </p>
              </div>

              {conversation.messages.length ===
              0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-gray-500">
                    No messages yet.
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Send a message to start the
                    conversation.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {conversation.messages.map(
                    (item, index) => {
                      const mine =
                        item.senderId ===
                        currentUserId;

                      const previous =
                        conversation.messages[
                          index - 1
                        ];

                      const showDate =
                        !previous ||
                        new Date(
                          item.createdAt
                        ).toDateString() !==
                          new Date(
                            previous.createdAt
                          ).toDateString();

                      return (
                        <div
                          key={item.id}
                        >
                          {showDate && (
                            <div className="my-6 flex items-center gap-3">
                              <div className="h-px flex-1 bg-gray-100" />

                              <span className="text-[11px] font-medium text-gray-400">
                                {formatMessageDate(
                                  item.createdAt
                                )}
                              </span>

                              <div className="h-px flex-1 bg-gray-100" />
                            </div>
                          )}

                          <div
                            className={`flex ${
                              mine
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[82%] sm:max-w-[70%] ${
                                mine
                                  ? "items-end"
                                  : "items-start"
                              }`}
                            >
                              <div
                                className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                                  mine
                                    ? "rounded-br-md bg-black text-white"
                                    : "rounded-bl-md bg-gray-100 text-gray-900"
                                }`}
                              >
                                <p className="whitespace-pre-wrap break-words">
                                  {item.content}
                                </p>
                              </div>

                              <div
                                className={`mt-1 flex items-center gap-1 px-1 ${
                                  mine
                                    ? "justify-end"
                                    : "justify-start"
                                }`}
                              >
                                <span className="text-[10px] text-gray-400">
                                  {formatMessageTime(
                                    item.createdAt
                                  )}
                                </span>

                                {mine && (
                                  <span
                                    className={`text-[10px] ${
                                      item.read
                                        ? "text-blue-500"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {item.read
                                      ? "Read"
                                      : "Sent"}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}

                  <div
                    ref={messagesEndRef}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ==================================================
              ERROR BANNER
          ================================================== */}

          {error && (
            <div className="shrink-0 border-t border-red-100 bg-red-50 px-4 py-2.5 text-center text-xs text-red-700">
              {error}
            </div>
          )}

          {/* ==================================================
              MESSAGE INPUT
          ================================================== */}

          <form
            onSubmit={handleSendMessage}
            className="shrink-0 border-t border-gray-200 bg-white p-3 sm:p-4"
          >
            <div className="mx-auto flex max-w-3xl items-end gap-2">
              <textarea
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();

                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder="Write a message..."
                rows={1}
                disabled={sending}
                className="max-h-32 min-h-11 flex-1 resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={
                  sending ||
                  !message.trim()
                }
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                aria-label="Send message"
              >
                {sending ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-white" />
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                  >
                    <path
                      d="M22 2L11 13"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    <path
                      d="M22 2l-7 20-4-9-9-4 20-7z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </div>

            <p className="mx-auto mt-2 max-w-3xl px-1 text-[10px] text-gray-400">
              Press Enter to send · Shift + Enter
              for a new line
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}