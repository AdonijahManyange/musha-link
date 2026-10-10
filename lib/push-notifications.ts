import webpush from "web-push";
import { prisma } from "@/lib/prisma";

// ============================================================
// PUSH NOTIFICATION CONFIGURATION
// ============================================================

const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const subject =
  process.env.VAPID_SUBJECT || "mailto:notifications@mushalink.com";

// Configure VAPID only when the required environment variables exist.
// This prevents a missing configuration from breaking message delivery.
const isPushConfigured = Boolean(publicKey && privateKey);

if (isPushConfigured) {
  webpush.setVapidDetails(
    subject,
    publicKey!,
    privateKey!
  );
}

// ============================================================
// SEND PUSH NOTIFICATION
// ============================================================

type SendPushNotificationOptions = {
  userId: string;
  title: string;
  message: string;
  link?: string;
};

export async function sendPushNotification({
  userId,
  title,
  message,
  link = "/",
}: SendPushNotificationOptions): Promise<void> {
  // ----------------------------------------------------------
  // Check configuration
  // ----------------------------------------------------------

  if (!isPushConfigured) {
    console.warn(
      "Push notifications skipped: VAPID keys are not configured."
    );

    return;
  }

  // ----------------------------------------------------------
  // Find the recipient's browser subscriptions
  // ----------------------------------------------------------

  const subscriptions = await prisma.pushSubscription.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      endpoint: true,
      p256dh: true,
      auth: true,
    },
  });

  if (subscriptions.length === 0) {
    console.info(
      `No push subscriptions found for user ${userId}.`
    );

    return;
  }

  // ----------------------------------------------------------
  // Prepare notification payload
  // ----------------------------------------------------------

  const payload = JSON.stringify({
    title,
    message,
    link,
  });

  // ----------------------------------------------------------
  // Send to all registered browsers
  // ----------------------------------------------------------

  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          payload
        );
      } catch (error) {
        const statusCode =
          typeof error === "object" &&
          error !== null &&
          "statusCode" in error
            ? (error as { statusCode?: number }).statusCode
            : undefined;

        // Remove subscriptions that are no longer valid.
        if (statusCode === 404 || statusCode === 410) {
          await prisma.pushSubscription
            .delete({
              where: {
                id: subscription.id,
              },
            })
            .catch((deleteError) => {
              console.error(
                "Failed to remove expired push subscription:",
                deleteError
              );
            });

          return;
        }

        // A failed push must never invalidate a successfully
        // created message or in-app notification.
        console.error(
          "Failed to deliver browser push notification:",
          error
        );
      }
    })
  );
}
