"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  const [markingAllRead, setMarkingAllRead] = useState(false);

  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const requestVersionRef = useRef(0);

  // ============================================================
  // LOAD NOTIFICATIONS
  // ============================================================

  const loadNotifications = useCallback(async () => {
    const requestVersion = ++requestVersionRef.current;

    try {
      const response = await fetch("/api/notifications", {
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      // Ignore an older request if a newer request has started.
      if (requestVersion !== requestVersionRef.current) {
        return;
      }

      setNotifications(data.notifications ?? []);
      setUnreadCount(data.unreadCount ?? 0);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================================
  // INITIAL LOAD + PERIODIC REFRESH
  // ============================================================

  useEffect(() => {
    void loadNotifications();

    const interval = window.setInterval(() => {
      void loadNotifications();
    }, 30000);

    return () => {
      window.clearInterval(interval);

      // Invalidate pending responses when the component unmounts.
      requestVersionRef.current += 1;
    };
  }, [loadNotifications]);

  // ============================================================
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE OR PRESSING ESCAPE
  // ============================================================

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setSelectedNotification(null);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // ============================================================
  // MARK ALL NOTIFICATIONS AS READ
  // ============================================================

  async function markAllAsRead() {
    if (markingAllRead || unreadCount === 0) {
      return;
    }

    setMarkingAllRead(true);

    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Unable to mark notifications as read.");
      }

      // Invalidate requests that may contain stale unread data.
      requestVersionRef.current += 1;

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    } finally {
      setMarkingAllRead(false);
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
        throw new Error("Unable to mark notification as read.");
      }

      requestVersionRef.current += 1;

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
    setOpen(false);

    // Navigate even if marking the notification read fails.
    const destination = notification.link?.trim();

    const isInternalDestination =
      !!destination &&
      destination.startsWith("/") &&
      !destination.startsWith("//") &&
      !destination.includes("\\") &&
      !destination.includes("\r") &&
      !destination.includes("\n");

    if (isInternalDestination) {
      setSelectedNotification(null);

      void markAsRead(notification);

      router.push(destination);
      return;
    }

    await markAsRead(notification);

    setSelectedNotification(notification);
  }

  // ============================================================
  // FORMAT DATE
  // ============================================================

  function formatDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
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
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
          aria-expanded={open}
          aria-haspopup="true"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-brand-blue"
        >
          <Bell size={21} />

          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <>
            {/* Mobile: fixed to viewport so it cannot overflow the screen. */}
            <div
              className="fixed left-3 right-3 top-[170px] z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:hidden"
              style={{
                maxHeight: "min(65dvh, 520px)",
              }}
            >
              <NotificationPanel
                notifications={notifications}
                unreadCount={unreadCount}
                loading={loading}
                markingAllRead={markingAllRead}
                onMarkAllRead={() => void markAllAsRead()}
                onNotificationClick={(notification) =>
                  void handleNotificationClick(notification)
                }
                formatDate={formatDate}
              />
            </div>

            {/* Desktop: anchored to the notification bell. */}
            <div
              className="absolute right-0 top-12 z-50 hidden w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:block"
              style={{
                maxHeight: "min(70dvh, 520px)",
              }}
            >
              <NotificationPanel
                notifications={notifications}
                unreadCount={unreadCount}
                loading={loading}
                markingAllRead={markingAllRead}
                onMarkAllRead={() => void markAllAsRead()}
                onNotificationClick={(notification) =>
                  void handleNotificationClick(notification)
                }
                formatDate={formatDate}
              />
            </div>
          </>
        )}
      </div>

      {/* ======================================================
          NOTIFICATION DETAIL MODAL
          ====================================================== */}

      {selectedNotification && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 py-6"
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
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Notification
                </p>

                <h2
                  id="notification-detail-title"
                  className="mt-1 break-words text-xl font-bold text-slate-900"
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
              <p className="break-words text-sm leading-6 text-slate-700">
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

// ============================================================
// REUSABLE NOTIFICATION PANEL
// ============================================================

function NotificationPanel({
  notifications,
  unreadCount,
  loading,
  markingAllRead,
  onMarkAllRead,
  onNotificationClick,
  formatDate,
}: {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markingAllRead: boolean;
  onMarkAllRead: () => void;
  onNotificationClick: (notification: Notification) => void;
  formatDate: (value: string) => string;
}) {
  return (
    <div className="flex min-h-0 flex-col">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900">
            Notifications
          </h3>

          {unreadCount > 0 && (
            <p className="mt-0.5 text-xs text-slate-500">
              {unreadCount} unread
            </p>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllRead}
            disabled={markingAllRead}
            className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-brand-blue hover:underline disabled:opacity-50"
          >
            <CheckCheck size={15} />
            {markingAllRead ? "Updating..." : "Mark all read"}
          </button>
        )}
      </div>

      {/* Scrollable notification list */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
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
              onClick={() => onNotificationClick(notification)}
              className={`block w-full text-left transition hover:bg-slate-50 ${
                !notification.read ? "bg-blue-50/50" : ""
              }`}
            >
              <div className="flex gap-3 border-b border-slate-100 px-4 py-4">
                {/* Unread indicator */}
                <div className="pt-1">
                  <span
                    className={`block h-2.5 w-2.5 rounded-full ${
                      notification.read
                        ? "bg-transparent"
                        : "bg-brand-blue"
                    }`}
                  />
                </div>

                {/* Notification content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
                    <p className="break-words text-sm font-semibold leading-5 text-slate-900">
                      {notification.title}
                    </p>

                    <span className="shrink-0 text-[10px] leading-4 text-slate-400">
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>

                  <p className="mt-1 break-words text-sm leading-5 text-slate-600">
                    {notification.message}
                  </p>

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
  );
}