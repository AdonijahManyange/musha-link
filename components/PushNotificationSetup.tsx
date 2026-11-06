"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// ============================================================
// PUSH NOTIFICATION SETUP
// ============================================================

export default function PushNotificationSetup() {
  const pathname = usePathname();

  useEffect(() => {
    async function registerServiceWorker() {
      // --------------------------------------------------------
      // Browser support
      // --------------------------------------------------------

      if (
        typeof window === "undefined" ||
        !("serviceWorker" in navigator)
      ) {
        console.log(
          "Service workers are not supported."
        );

        return;
      }

      try {
        // ------------------------------------------------------
        // Register service worker
        // ------------------------------------------------------

        const registration =
          await navigator.serviceWorker.register(
            "/sw.js"
          );

        if (
          !("Notification" in window) ||
          !("PushManager" in window) ||
          Notification.permission !== "granted" ||
          pathname === "/"
        ) {
          return;
        }

        const sessionResponse = await fetch("/api/auth/session", {
          cache: "no-store",
        });
        const session = await sessionResponse.json().catch(() => null);
        if (!session?.user) return;

        const readyRegistration = await navigator.serviceWorker.ready;
        const subscription = await readyRegistration.pushManager.getSubscription();
        if (!subscription) return;

        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscription.toJSON()),
        });

        console.log(
          "MushaLink service worker registered:",
          registration.scope
        );
      } catch (error) {
        console.error(
          "Failed to register MushaLink service worker:",
          error
        );
      }
    }

    registerServiceWorker();
  }, [pathname]);

  return null;
}
