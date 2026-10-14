import { Resend } from "resend";

type SendNotificationEmailProps = {
  to: string;
  subject: string;
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
};

// Escape dynamic text before inserting it into HTML.
// This prevents characters such as < and > from being interpreted as HTML.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendNotificationEmail({
  to,
  subject,
  title,
  message,
  actionUrl,
  actionText = "Open MushaLink",
}: SendNotificationEmailProps) {
  // ------------------------------------------------------------
  // ENVIRONMENT VARIABLES
  // ------------------------------------------------------------

  const resendApiKey = process.env.RESEND_API_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  if (!appUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL is not configured.");
  }

  // ------------------------------------------------------------
  // PREPARE EMAIL CONTENT
  // ------------------------------------------------------------

  const resend = new Resend(resendApiKey);

  const safeTitle = escapeHtml(title);
  const safeMessage = escapeHtml(message);
  const safeActionText = escapeHtml(actionText);

  // Normalize the base URL so we don't accidentally produce
  // URLs containing a double slash.
  const normalizedAppUrl = appUrl.replace(/\/+$/, "");

  // Only accept relative application paths for notification links.
  let safeActionUrl: string | undefined;

  if (actionUrl) {
    if (
      !actionUrl.startsWith("/") ||
      actionUrl.startsWith("//")
    ) {
      throw new Error("Invalid notification action URL.");
    }

    safeActionUrl = `${normalizedAppUrl}${actionUrl}`;
  }

  // ------------------------------------------------------------
  // SEND EMAIL
  // ------------------------------------------------------------

  const { error } = await resend.emails.send({
    from: "MushaLink <notifications@mushalink.com>",
    to,
    subject,

    html: `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 32px;
          color: #1e293b;
        "
      >
        <h1
          style="
            color: #1f3b73;
            margin-bottom: 16px;
          "
        >
          ${safeTitle}
        </h1>

        <p
          style="
            font-size: 15px;
            line-height: 1.6;
          "
        >
          ${safeMessage}
        </p>

        ${
          safeActionUrl
            ? `
              <p style="margin: 32px 0;">
                <a
                  href="${escapeHtml(safeActionUrl)}"
                  style="
                    display: inline-block;
                    padding: 14px 24px;
                    background-color: #1f3b73;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: bold;
                  "
                >
                  ${safeActionText}
                </a>
              </p>
            `
            : ""
        }

        <p
          style="
            margin-top: 32px;
            font-size: 14px;
            color: #64748b;
          "
        >
          — The MushaLink Team
        </p>
      </div>
    `,
  });

  // ------------------------------------------------------------
  // HANDLE RESEND ERRORS
  // ------------------------------------------------------------

  if (error) {
    console.error("Email notification error:", error);

    throw new Error("Failed to send notification email.");
  }

  return {
    success: true,
  };
}