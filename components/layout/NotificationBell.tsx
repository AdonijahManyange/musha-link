"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, ExternalLink } from "lucide-react";

// ============================================================
// TYPES
// ============================================================

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link: string | null;
  createdAt: string;
};

// ============================================================
// COMPONENT
// ============================================================

export default function NotificationBell() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // ============================================================
  // LOAD NOTIFICATIONS
  // ============================================================

  async function loadNotifications() {
    try {
      const response = await fetch("/api/notifications", {
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setNotifications(data.notifications ?? []);
      setUnreadCount(data.unreadCount ?? 0);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // INITIAL LOAD + PERIODIC REFRESH
  // ============================================================

  useEffect(() => {
    void loadNotifications();

    const interval = setInterval(() => {
      void loadNotifications();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // ============================================================
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  // ============================================================

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ============================================================
  // MARK ALL NOTIFICATIONS AS READ
  // ============================================================

  async function markAllAsRead() {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
      });

      if (!response.ok) {
        return;
      }

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  }

  // ============================================================
  // MARK ONE NOTIFICATION AS READ
  // ============================================================

  async function markAsRead(notification: Notification) {
    if (notification.read) {
      return;
    }

    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationId: notification.id,
        }),
      });

      if (!response.ok) {
        return;
      }

      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? { ...item, read: true }
            : item
        )
      );

      setUnreadCount((current) => Math.max(0, current - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  }

  // ============================================================
  // OPEN NOTIFICATION DESTINATION
  // ============================================================

  async function handleNotificationClick(
    notification: Notification
  ) {
    // Close the dropdown immediately.
    setOpen(false);

    // Mark the notification as read.
    // Navigation should still work if this request fails.
    await markAsRead(notification);

    // Only navigate to local application paths.
    // This prevents an untrusted database link from redirecting
    // users to an arbitrary external website.
    const destination = notification.link?.trim();

    if (
      destination &&
      destination.startsWith("/") &&
      !destination.startsWith("//") &&
      !destination.includes("\\")
    ) {
      setSelectedNotification(null);
      router.push(destination);
      return;
    }

    // Notifications without a valid destination still open
    // their details so the user can read the message.
    setSelectedNotification(notification);
  }

  // ============================================================
  // FORMAT DATE
  // ============================================================

  function formatDate(date: string) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(parsedDate);
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      {/* ======================================================
          NOTIFICATION BELL + DROPDOWN
          ====================================================== */}

      <div ref={dropdownRef} className="relative">
        {/* Notification Bell */}

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-label="Notifications"
          aria-expanded={open}
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-brand-blue"
        >
          <Bell size={21} />

          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown */}

        {open && (
          <div className="absolute right-0 top-12 z-50 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            {/* Dropdown Header */}

            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <div>
                <h3 className="font-semibold text-slate-900">
                  Notifications
                </h3>

                {unreadCount > 0 && (
                  <p className="text-xs text-slate-500">
                    {unreadCount} unread
                  </p>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => void markAllAsRead()}
                  className="flex items-center gap-1.5 text-xs font-medium text-brand-blue hover:underline"
                >
                  <CheckCheck size={15} />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification List */}

            <div className="max-h-[420px] overflow-y-auto">
              {loading ? (
                <div className="px-4 py-8 text-center text-sm text-slate-500">
                  Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <Bell
                    size={28}
                    className="mx-auto mb-2 text-slate-300"
                  />

                  <p className="text-sm font-medium text-slate-700">
                    No notifications
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    You&apos;re all caught up.
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() =>
                      void handleNotificationClick(notification)
                    }
                    className={`block w-full text-left transition hover:bg-slate-50 ${
                      !notification.read ? "bg-blue-50/50" : ""
                    }`}
                  >
                    <div className="flex gap-3 border-b border-slate-100 px-4 py-4">
                      {/* Unread Indicator */}

                      <div className="pt-1">
                        <span
                          className={`block h-2.5 w-2.5 rounded-full ${
                            notification.read
                              ? "bg-transparent"
                              : "bg-brand-blue"
                          }`}
                        />
                      </div>

                      {/* Notification Content */}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-900">
                            {notification.title}
                          </p>

                          <span className="shrink-0 text-[10px] text-slate-400">
                            {formatDate(notification.createdAt)}
                          </span>
                        </div>

                        <p className="mt-1 text-sm leading-5 text-slate-600">
                          {notification.message}
                        </p>

                        {/* Indicate that the notification opens a page */}

                        {notification.link && (
                          <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-blue">
                            View details
                            <ExternalLink size={12} />
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* ======================================================
          NOTIFICATION DETAIL MODAL
          Used when a notification has no valid destination.
          ====================================================== */}

      {selectedNotification && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
          onClick={() => setSelectedNotification(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="notification-detail-title"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Notification
                </p>

                <h2
                  id="notification-detail-title"
                  className="mt-1 text-xl font-bold text-slate-900"
                >
                  {selectedNotification.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedNotification(null)}
                aria-label="Close notification"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <p className="text-sm leading-6 text-slate-700">
                {selectedNotification.message}
              </p>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              {formatDate(selectedNotification.createdAt)}
            </p>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedNotification(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}