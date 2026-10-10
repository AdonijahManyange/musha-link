// ============================================================
// MUSHA-LINK SERVICE WORKER
// ============================================================

// ------------------------------------------------------------
// INSTALL
// ------------------------------------------------------------

self.addEventListener("install", () => {
  console.log("MushaLink service worker installed.");

  self.skipWaiting();
});

// ------------------------------------------------------------
// ACTIVATE
// ------------------------------------------------------------

self.addEventListener("activate", (event) => {
  console.log("MushaLink service worker activated.");

  event.waitUntil(self.clients.claim());
});

// ------------------------------------------------------------
// PUSH
// ------------------------------------------------------------

self.addEventListener("push", (event) => {
  console.log("MushaLink push received.");

  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (error) {
    console.error(
      "Failed to parse push notification:",
      error
    );
  }

  const title = data.title || "MushaLink";

  const options = {
    body:
      data.message ||
      "You have a new notification.",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    data: {
      link: data.link || "/",
    },
  };

  event.waitUntil(
    self.registration.showNotification(
      title,
      options
    )
  );
});

// ------------------------------------------------------------
// NOTIFICATION CLICK
// ------------------------------------------------------------

self.addEventListener(
  "notificationclick",
  (event) => {
    event.notification.close();

    const link =
      event.notification.data?.link || "/";

    event.waitUntil(
      self.clients
        .matchAll({
          type: "window",
          includeUncontrolled: true,
        })
        .then((clientList) => {
          for (const client of clientList) {
            if (
              "focus" in client &&
              client.url.includes(
                self.location.origin
              )
            ) {
              return client.focus();
            }
          }

          if (self.clients.openWindow) {
            return self.clients.openWindow(
              new URL(
                link,
                self.location.origin
              ).href
            );
          }

          return undefined;
        })
    );
  }
);
