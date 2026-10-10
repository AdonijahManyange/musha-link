"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

// ============================================================
// COMPONENT
// ============================================================

export default function MessagesButton() {
  const [unreadCount, setUnreadCount] = useState(0);

  // ============================================================
  // LOAD UNREAD MESSAGE COUNT
  // ============================================================

  const loadUnreadCount = useCallback(async () => {
    try {
      const response = await fetch(
        "/api/messages/unread-count",
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setUnreadCount(
        typeof data.unreadCount === "number"
          ? data.unreadCount
          : 0
      );
    } catch (error) {
      console.error(
        "Failed to load unread message count:",
        error
      );
    }
  }, []);

  // ============================================================
  // INITIAL LOAD + AUTOMATIC REFRESH
  // ============================================================

  useEffect(() => {
    loadUnreadCount();

    const interval = window.setInterval(
      loadUnreadCount,
      30000
    );

    // Refresh when the user returns to the tab.
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        loadUnreadCount();
      }
    }

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
  }, [loadUnreadCount]);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <Link
      href="/messages"
      aria-label={
        unreadCount > 0
          ? `Messages, ${unreadCount} unread`
          : "Messages"
      }
      title="Messages"
      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-brand-blue"
    >
      <MessageCircle size={21} />

      {unreadCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
