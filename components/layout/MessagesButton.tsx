"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function MessagesButton() {
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch the total number of unread messages for the current user.
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await fetch("/api/messages/unread-count", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      if (typeof data.unreadCount === "number") {
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error("Failed to fetch unread message count:", error);
    }
  }, []);

  useEffect(() => {
    // Load the count immediately.
    fetchUnreadCount();

    // Refresh the count every 30 seconds.
    const interval = window.setInterval(fetchUnreadCount, 30_000);

    // Refresh when the user returns to the browser tab.
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchUnreadCount();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      window.clearInterval(interval);

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [fetchUnreadCount]);

  return (
    <Link
      href="/messages"
      aria-label={
        unreadCount > 0
          ? `Messages, ${unreadCount} unread`
          : "Messages"
      }
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100"
    >
      <MessageCircle
        size={22}
        strokeWidth={1.8}
        aria-hidden="true"
      />

      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
}