import { Resend } from "resend";

type NotificationEmailParams = {
  to: string;
  name?: string | null;
  title: string;
  message: string;
  link?: string | null;
};

export async function sendNotificationEmail({
  to,
  name,
  title,
  message,
  link,
}: NotificationEmailParams) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    throw new Error(
      "NEXT_PUBLIC_APP_URL is not configured."
    );
  }

  const notificationUrl = link
    ? `${appUrl}${link}`
    : appUrl;

  const { error } = await resend.emails.send({
    from: "MushaLink <onboarding@resend.dev>",
    to,
    subject: title,
    html: `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 32px;
        "
      >
        <h1 style="color: #1f3b73;">
          ${title}
        </h1>

        <p>
          Hi ${name || "there"},
        </p>

        <p>
          ${message}
        </p>

        <p style="margin: 32px 0;">
          <a
            href="${notificationUrl}"
            style="
              display: inline-block;
              padding: 14px 24px;
              background-color: #1f3b73;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
            "
          >
            View on MushaLink
          </a>
        </p>

        <p>
          — The MushaLink Team
        </p>
      </div>
    `,
  });

  if (error) {
    console.error(
      "Notification email error:",
      error
    );

    throw new Error(
      "Failed to send notification email."
    );
  }
}