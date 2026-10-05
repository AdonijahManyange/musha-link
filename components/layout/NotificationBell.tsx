"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link: string | null;
  createdAt: string;
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // ============================================================
  // Load notifications
  // ============================================================

  async function loadNotifications() {
    try {
      const response = await fetch(
        "/api/notifications",
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setNotifications(data.notifications ?? []);
      setUnreadCount(data.unreadCount ?? 0);
    } catch (error) {
      console.error(
        "Failed to load notifications:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // Initial load + refresh
  // ============================================================

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(
      loadNotifications,
      30000
    );

    return () => clearInterval(interval);
  }, []);

  // ============================================================
  // Close dropdown when clicking outside
  // ============================================================

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ============================================================
  // Mark all notifications as read
  // ============================================================

  async function markAllAsRead() {
    try {
        const response = await fetch(
        "/api/notifications",
        {
            method: "PATCH",
        }
        );

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
        console.error(
        "Failed to mark notifications as read:",
        error
        );
    }
   }

  async function markAsRead(notification: Notification) {
    if (notification.read) {
        setOpen(false);
        return;
    }

    try {
        const response = await fetch(
        "/api/notifications",
        {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            notificationId: notification.id,
            }),
        }
        );

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

        setUnreadCount((current) =>
        Math.max(0, current - 1)
        );

        setOpen(false);
    } catch (error) {
        console.error(
        "Failed to mark notification as read:",
        error
        );
    }
    }

  // ============================================================
  // Format notification time
  // ============================================================

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(date));
  }

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      {/* Bell */}
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
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-12 z-50 w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          {/* Header */}
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
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 text-xs font-medium text-brand-blue hover:underline"
              >
                <CheckCheck size={15} />
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications */}
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
                  You're all caught up.
                </p>
              </div>
            ) : (
              notifications.map((notification) => {
                const content = (
                  <div
                    className={`flex gap-3 border-b border-slate-100 px-4 py-4 transition hover:bg-slate-50 ${
                      !notification.read
                        ? "bg-blue-50/50"
                        : ""
                    }`}
                  >
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

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">
                          {notification.title}
                        </p>

                        <span className="shrink-0 text-[10px] text-slate-400">
                          {formatDate(
                            notification.createdAt
                          )}
                        </span>
                      </div>

                      <p className="mt-1 text-sm leading-5 text-slate-600">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                );

                return notification.link ? (
                  <Link
                    key={notification.id}
                    href={notification.link}
                    onClick={() => markAsRead(notification)}
                  >
                    {content}
                  </Link>
                ) : (
                  <div key={notification.id}>
                    {content}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}