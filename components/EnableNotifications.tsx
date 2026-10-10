"use client";

import { useCallback, useEffect, useState } from "react";

// ============================================================
// TYPES
// ============================================================

type PermissionState =
  | "default"
  | "granted"
  | "denied"
  | "unsupported";

type SetupStatus =
  | "checking"
  | "ready"
  | "needs-permission"
  | "blocked"
  | "unsupported";

// ============================================================
// COMPONENT
// ============================================================

export default function EnableNotifications() {
  const [permission, setPermission] =
    useState<PermissionState>("default");

  const [status, setStatus] =
    useState<SetupStatus>("checking");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState<string | null>(
    null
  );

  // ============================================================
  // SYNCHRONIZE SUBSCRIPTION WITH THE SERVER
  // ============================================================

  const synchronizeSubscription = useCallback(
    async (requestPermission: boolean) => {
      setLoading(true);
      setMessage(null);
      setStatus("checking");

      try {
        // --------------------------------------------------------
        // Check browser support
        // --------------------------------------------------------

        if (
          !("Notification" in window) ||
          !("serviceWorker" in navigator) ||
          !("PushManager" in window)
        ) {
          setPermission("unsupported");
          setStatus("unsupported");
          return;
        }

        // --------------------------------------------------------
        // Request permission only after a user action
        // --------------------------------------------------------

        let currentPermission = Notification.permission;

        if (
          currentPermission !== "granted" &&
          requestPermission
        ) {
          currentPermission =
            await Notification.requestPermission();
        }

        setPermission(
          currentPermission as PermissionState
        );

        if (currentPermission !== "granted") {
          if (currentPermission === "denied") {
            setStatus("blocked");

            setMessage(
              "Notifications are blocked. Enable them in your browser settings."
            );
          } else {
            setStatus("needs-permission");

            setMessage(
              "Allow notifications to receive MushaLink alerts."
            );
          }

          return;
        }

        // --------------------------------------------------------
        // Get the registered service worker
        // --------------------------------------------------------

        const registration =
          await navigator.serviceWorker.ready;

        // --------------------------------------------------------
        // Get VAPID public key
        // --------------------------------------------------------

        const vapidPublicKey =
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

        if (!vapidPublicKey) {
          throw new Error(
            "VAPID public key is not configured."
          );
        }

        // --------------------------------------------------------
        // Convert VAPID public key
        // --------------------------------------------------------

        const applicationServerKey =
          urlBase64ToUint8Array(vapidPublicKey);

        // --------------------------------------------------------
        // Get or create the browser subscription
        // --------------------------------------------------------

        let subscription =
          await registration.pushManager.getSubscription();

        if (subscription) {
          // Ensure the existing subscription uses our current VAPID key.
          const existingKey =
            subscription.options.applicationServerKey;

          const existingKeyString = existingKey
            ? uint8ArrayToBase64Url(
                new Uint8Array(existingKey)
              )
            : null;

          if (existingKeyString !== vapidPublicKey) {
            await subscription.unsubscribe();
            subscription = null;
          }
        }

        if (!subscription) {
          subscription =
            await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey,
            });
        }

        // --------------------------------------------------------
        // Save subscription to MushaLink
        // --------------------------------------------------------

        const response = await fetch(
          "/api/push/subscribe",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(
              subscription.toJSON()
            ),
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data?.error ??
              "Failed to save notification subscription."
          );
        }

        // --------------------------------------------------------
        // Success
        // --------------------------------------------------------

        setStatus("ready");

        setMessage(
          "Browser notifications are enabled and your subscription is saved."
        );
      } catch (error) {
        console.error(
          "Failed to synchronize push subscription:",
          error
        );

        setStatus("needs-permission");

        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to configure browser notifications."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ============================================================
  // INITIALIZE
  // ============================================================

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("Notification" in window) ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window)
    ) {
      setPermission("unsupported");
      setStatus("unsupported");
      return;
    }

    const currentPermission =
      Notification.permission as PermissionState;

    setPermission(currentPermission);

    if (currentPermission === "denied") {
      setStatus("blocked");
      return;
    }

    if (currentPermission !== "granted") {
      setStatus("needs-permission");
      return;
    }

    // Permission already exists, so synchronize the subscription
    // without prompting the user again.
    void synchronizeSubscription(false);
  }, [synchronizeSubscription]);

  // ============================================================
  // UNSUPPORTED
  // ============================================================

  if (status === "unsupported") {
    return null;
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="flex flex-col items-start gap-2">
      {status === "ready" ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="text-sm font-medium text-emerald-800">
            Browser notifications are enabled.
          </p>

          <p className="mt-1 text-xs text-emerald-700">
            Your notification subscription is saved.
          </p>

          <button
            type="button"
            onClick={() =>
              synchronizeSubscription(false)
            }
            disabled={loading}
            className="mt-2 text-xs font-semibold text-emerald-800 underline disabled:opacity-60"
          >
            {loading
              ? "Checking..."
              : "Sync subscription again"}
          </button>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() =>
              synchronizeSubscription(true)
            }
            disabled={loading || status === "checking"}
            className="rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Setting up..."
              : permission === "granted"
                ? "Finish Notification Setup"
                : "Enable Notifications"}
          </button>

          {message && (
            <p className="max-w-md text-xs text-slate-600">
              {message}
            </p>
          )}
        </>
      )}
    </div>
  );
}

// ============================================================
// HELPERS
// ============================================================

function urlBase64ToUint8Array(
  base64String: string
): Uint8Array<ArrayBuffer> {
  const padding =
    "=".repeat((4 - (base64String.length % 4)) % 4);

  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);

  const result = new Uint8Array(
    new ArrayBuffer(rawData.length)
  );

  for (let index = 0; index < rawData.length; index++) {
    result[index] = rawData.charCodeAt(index);
  }

  return result;
}

function uint8ArrayToBase64Url(
  bytes: Uint8Array
): string {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return window
    .btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}