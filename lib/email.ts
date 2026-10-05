import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNotificationEmail({
  to,
  subject,
  title,
  message,
  actionUrl,
  actionText = "Open MushaLink",
}: {
  to: string;
  subject: string;
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    throw new Error(
      "NEXT_PUBLIC_APP_URL is not configured."
    );
  }

  const { error } = await resend.emails.send({
    from: "MushaLink <onboarding@resend.dev>",
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #1f3b73;">
          ${title}
        </h1>

        <p>
          ${message}
        </p>

        ${
          actionUrl
            ? `
              <p style="margin: 32px 0;">
                <a
                  href="${appUrl}${actionUrl}"
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
                  ${actionText}
                </a>
              </p>
            `
            : ""
        }

        <p>
          — The MushaLink Team
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Email notification error:", error);
    throw new Error("Failed to send notification email.");
  }
}