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

type StudentProfile = {
  profilePhotoUrl: string | null;
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
  student: Student;
  landlord: Landlord;
  messages: Message[];
};

// ============================================================
// HELPERS
// ============================================================

function formatMessageTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatMessageDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
    return "Today";
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return date.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
    year:
      date.getFullYear() !== now.getFullYear()
        ? "numeric"
        : undefined,
  });
}

function getPersonPhoto(person: Student | Landlord) {
  if ("studentProfile" in person) {
    return person.studentProfile?.profilePhotoUrl ?? null;
  }

  return person.landlordProfile?.profilePhotoUrl ?? null;
}

function getPersonInitial(person: Student | Landlord) {
  return (person.name ?? person.email).charAt(0).toUpperCase();
}

// ============================================================
// PAGE
// ============================================================

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();

  const conversationId =
    typeof params.id === "string" ? params.id : null;

  const [conversation, setConversation] =
    useState<Conversation | null>(null);

  const [currentUserId, setCurrentUserId] =
    useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  // ==========================================================
  // LOAD CURRENT USER
  // ==========================================================

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/session", {
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load your session.");
        }

        const data = await response.json();
        const user = data?.user;

        if (!user?.id) {
          router.push("/login");
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
  }, [router]);

  // ==========================================================
  // LOAD CONVERSATION
  // ==========================================================

  useEffect(() => {
    if (!conversationId || !currentUserId) {
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

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ?? "Unable to load conversation."
          );
        }

        setConversation(data?.conversation ?? null);
      } catch (error) {
        console.error("Failed to load conversation:", error);

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
  }, [conversationId, currentUserId]);

  // ==========================================================
  // SCROLL TO THE NEWEST MESSAGE
  // ==========================================================

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!conversation || !container) {
      return;
    }

    requestAnimationFrame(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "auto",
      });
    });
  }, [conversation]);

  // ==========================================================
  // SEND MESSAGE
  // ==========================================================

  async function handleSendMessage(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!conversationId || !message.trim() || sending) {
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
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ message: content }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ?? "Unable to send message."
        );
      }

      const createdMessage = data?.message as
        | Message
        | undefined;

      if (createdMessage) {
        setConversation((current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            messages: [...current.messages, createdMessage],
            updatedAt: createdMessage.createdAt,
          };
        });
      }

      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);

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
      <main className="flex min-h-dvh items-center justify-center bg-background px-4">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-border border-t-brand-blue" />

          <p className="mt-4 text-sm text-text-muted">
            Loading conversation...
          </p>
        </div>
      </main>
    );
  }

  // ==========================================================
  // ERROR STATE
  // ==========================================================

  if (error && !conversation) {
    return (
      <main className="min-h-dvh bg-background px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-border bg-surface p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-xl font-bold text-red-600 dark:bg-red-950 dark:text-red-300">
              !
            </div>

            <h1 className="mt-4 text-xl font-semibold text-text-primary">
              Unable to load conversation
            </h1>

            <p className="mt-2 text-sm text-text-secondary">
              {error}
            </p>

            <Link
              href="/messages"
              className="mt-6 inline-flex rounded-xl bg-brand-blue px-5 py-3 text-sm font-medium text-white transition hover:bg-brand-blue-dark"
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
  // DETERMINE CONVERSATION PARTICIPANTS
  // ==========================================================

  const isStudent = conversation.studentId === currentUserId;

  const otherPerson = isStudent
    ? conversation.landlord
    : conversation.student;

  const otherPersonName =
    otherPerson.name ?? otherPerson.email;

  const otherPersonPhoto = getPersonPhoto(otherPerson);

  const listingPhoto =
    conversation.listing.photos[0]?.url ?? null;

  // ==========================================================
  // RENDER CONVERSATION
  // ==========================================================

  return (
    <main className="h-[calc(100dvh-90px)] overflow-hidden bg-background">
      <div className="mx-auto flex h-full max-w-6xl flex-col px-0 sm:px-4 sm:py-4">
        <div className="flex min-h-0 flex-1 flex-col bg-surface sm:rounded-2xl sm:border sm:border-border sm:shadow-sm">

          {/* HEADER */}

          <header className="flex shrink-0 items-center gap-3 border-b border-border bg-surface px-4 py-3 sm:px-5">
            <Link
              href="/messages"
              aria-label="Back to messages"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-text-secondary transition hover:bg-surface-secondary hover:text-text-primary"
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

            {/* Other person's profile photo */}

            <div className="shrink-0">
              {otherPersonPhoto ? (
                <img
                  src={otherPersonPhoto}
                  alt={otherPersonName}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue text-sm font-semibold text-white">
                  {getPersonInitial(otherPerson)}
                </div>
              )}
            </div>

            {/* Person and listing name */}

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-sm font-semibold text-text-primary">
                {otherPersonName}
              </h1>

              <p className="truncate text-xs text-text-muted">
                {conversation.listing.title}
              </p>
            </div>

            {/* Listing shortcut */}

            <Link
              href={`/listings/${conversation.listing.id}`}
              className="hidden shrink-0 items-center gap-2 rounded-xl border border-border px-2 py-1.5 transition hover:border-border-strong hover:bg-surface-secondary sm:flex"
            >
              {listingPhoto && (
                <img
                  src={listingPhoto}
                  alt=""
                  className="h-8 w-8 rounded-lg object-cover"
                />
              )}

              <div className="max-w-40">
                <p className="truncate text-xs font-medium text-text-primary">
                  View listing
                </p>

                <p className="truncate text-[11px] text-text-muted">
                  {conversation.listing.city},{" "}
                  {conversation.listing.province}
                </p>
              </div>
            </Link>
          </header>

          {/* MESSAGES */}

          <div
            ref={messagesContainerRef}
            className="min-h-0 flex-1 overflow-y-auto bg-background px-4 py-6 sm:px-6"
          >
            <div className="mx-auto max-w-3xl">
              {conversation.messages.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-text-secondary">
                    No messages yet.
                  </p>

                  <p className="mt-1 text-xs text-text-muted">
                    Send a message to start the conversation.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {conversation.messages.map((item, index) => {
                    const mine = item.senderId === currentUserId;

                    const previous =
                      conversation.messages[index - 1];

                    const next =
                      conversation.messages[index + 1];

                    // Add a date separator when the day changes.
                    const showDate =
                      !previous ||
                      new Date(item.createdAt).toDateString() !==
                        new Date(previous.createdAt).toDateString();

                    const previousIsSameSender =
                      previous?.senderId === item.senderId;

                    const nextIsSameSender =
                      next?.senderId === item.senderId;

                    // Display avatar and time on the last message in a group.
                    const showAvatar = !nextIsSameSender;
                    const isFirstInGroup = !previousIsSameSender;

                    // Determine the sender's photo and display name.
                    let senderPhoto: string | null = null;
                    let senderName = "";

                    if (mine) {
                      if (isStudent) {
                        senderPhoto =
                          conversation.student.studentProfile
                            ?.profilePhotoUrl ?? null;

                        senderName =
                          conversation.student.name ??
                          conversation.student.email;
                      } else {
                        senderPhoto =
                          conversation.landlord.landlordProfile
                            ?.profilePhotoUrl ?? null;

                        senderName =
                          conversation.landlord.name ??
                          conversation.landlord.email;
                      }
                    } else if (isStudent) {
                      senderPhoto =
                        conversation.landlord.landlordProfile
                          ?.profilePhotoUrl ?? null;

                      senderName =
                        conversation.landlord.name ??
                        conversation.landlord.email;
                    } else {
                      senderPhoto =
                        conversation.student.studentProfile
                          ?.profilePhotoUrl ?? null;

                      senderName =
                        conversation.student.name ??
                        conversation.student.email;
                    }

                    return (
                      <div key={item.id}>
                        {/* DATE SEPARATOR */}

                        {showDate && (
                          <div className="my-6 flex items-center gap-3">
                            <div className="h-px flex-1 bg-border" />

                            <span className="text-[11px] font-medium text-text-muted">
                              {formatMessageDate(item.createdAt)}
                            </span>

                            <div className="h-px flex-1 bg-border" />
                          </div>
                        )}

                        {/* MESSAGE ROW */}

                        <div
                          className={`flex ${
                            mine ? "justify-end" : "justify-start"
                          } ${isFirstInGroup ? "mt-3" : "mt-1"}`}
                        >
                          <div
                            className={`flex max-w-[82%] items-end gap-2 sm:max-w-[70%] ${
                              mine ? "flex-row-reverse" : "flex-row"
                            }`}
                          >
                            {/* SENDER AVATAR */}

                            <div className="w-8 shrink-0">
                              {showAvatar &&
                                (senderPhoto ? (
                                  <img
                                    src={senderPhoto}
                                    alt={senderName}
                                    className="h-8 w-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue text-[11px] font-semibold text-white">
                                    {senderName.charAt(0).toUpperCase()}
                                  </div>
                                ))}
                            </div>

                            {/* MESSAGE BUBBLE AND STATUS */}

                            <div
                              className={`flex min-w-0 flex-col ${
                                mine ? "items-end" : "items-start"
                              }`}
                            >
                              <div
                                className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                                  mine
                                    ? "rounded-br-md bg-brand-blue text-white"
                                    : "rounded-bl-md bg-surface-secondary text-text-primary"
                                }`}
                              >
                                <p className="whitespace-pre-wrap break-words">
                                  {item.content}
                                </p>
                              </div>

                              {showAvatar && (
                                <div
                                  className={`mt-1 flex items-center gap-1 px-1 ${
                                    mine ? "justify-end" : "justify-start"
                                  }`}
                                >
                                  <span className="text-[10px] text-text-muted">
                                    {formatMessageTime(item.createdAt)}
                                  </span>

                                  {mine && (
                                    <span
                                      className={`text-[10px] ${
                                        item.read
                                          ? "text-brand-green"
                                          : "text-text-muted"
                                      }`}
                                    >
                                      {item.read ? "Read" : "Sent"}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* SEND ERROR */}

          {error && (
            <div
              role="alert"
              className="shrink-0 border-t border-red-200 bg-red-50 px-4 py-2.5 text-center text-xs text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
            >
              {error}
            </div>
          )}

          {/* MESSAGE INPUT */}

          <form
            onSubmit={handleSendMessage}
            className="shrink-0 border-t border-border bg-surface px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 sm:p-4"
          >
            <div className="mx-auto flex max-w-3xl items-end gap-2">
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
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
                className="min-h-11 max-h-32 flex-1 resize-none rounded-2xl border border-input-border bg-input-background px-4 py-3 text-base text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
              />

              <button
                type="submit"
                disabled={sending || !message.trim()}
                aria-label="Send message"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-blue text-white transition hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:bg-surface-tertiary disabled:text-text-muted"
              >
                {sending ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
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

            <p className="mx-auto mt-2 max-w-3xl px-1 text-[10px] text-text-muted">
              Press Enter to send · Shift + Enter for a new line
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}