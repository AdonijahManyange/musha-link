"use client";

import { useEffect } from "react";

// ============================================================
// PUSH NOTIFICATION SETUP
// ============================================================

export default function PushNotificationSetup() {
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
  }, []);

  return null;
}
