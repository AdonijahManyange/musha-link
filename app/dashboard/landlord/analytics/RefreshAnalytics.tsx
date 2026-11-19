"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RefreshAnalytics() {
  const router = useRouter();

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, 5000);

    return () => window.clearInterval(interval);
  }, [router]);

  return <p className="mt-2 text-xs text-text-secondary">Updates automatically every 5 seconds.</p>;
}
