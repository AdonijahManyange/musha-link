import { Resend } from "resend";

type SendNotificationEmailProps = {
  to: string;
  subject: string;
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
};

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
    throw new Error(
      "RESEND_API_KEY is not configured."
    );
  }

  if (!appUrl) {
    throw new Error(
      "NEXT_PUBLIC_APP_URL is not configured."
    );
  }

  // ------------------------------------------------------------
  // CREATE RESEND CLIENT
  // ------------------------------------------------------------

  const resend = new Resend(resendApiKey);

  // ------------------------------------------------------------
  // SEND EMAIL
  // ------------------------------------------------------------

  const { error } = await resend.emails.send({
    from: "MushaLink <onboarding@resend.dev>",
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
          ${title}
        </h1>

        <p
          style="
            font-size: 15px;
            line-height: 1.6;
          "
        >
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
                    color: #ffffff;
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
  // HANDLE RESEND ERROR
  // ------------------------------------------------------------

  if (error) {
    console.error(
      "Email notification error:",
      error
    );

    throw new Error(
      "Failed to send notification email."
    );
  }

  return {
    success: true,
  };
}