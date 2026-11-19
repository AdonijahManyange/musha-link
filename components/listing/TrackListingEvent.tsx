"use client";

import { useEffect } from "react";

function getVisitorKey() {
  const storageKey = "musha-analytics-visitor";
  try {
    const savedKey = window.localStorage.getItem(storageKey);
    if (savedKey) return savedKey;
    const newKey = typeof window.crypto.randomUUID === "function"
      ? window.crypto.randomUUID()
      : `visitor-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(storageKey, newKey);
    return newKey;
  } catch {
    return `visitor-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

export default function TrackListingEvent({
  listingId,
  type,
}: {
  listingId: string;
  type: "VIEW" | "IMPRESSION";
}) {
  useEffect(() => {
    void fetch("/api/analytics/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, visitorKey: getVisitorKey(), type }),
      keepalive: true,
    }).then((response) => {
      if (!response.ok) console.error("Listing analytics request failed:", response.status);
    }).catch((error) => {
      console.error("Listing analytics request could not be sent:", error);
    });
  }, [listingId, type]);

  return null;
}
