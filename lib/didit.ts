const DIDIT_API_URL = "https://verification.didit.me/v3";

export async function createDiditVerificationSession(
  userId: string
) {
  const apiKey = process.env.DIDIT_API_KEY;
  const workflowId = process.env.DIDIT_WORKFLOW_ID;

  if (!apiKey) {
    throw new Error("DIDIT_API_KEY is not configured");
  }

  if (!workflowId) {
    throw new Error("DIDIT_WORKFLOW_ID is not configured");
  }

  const response = await fetch(`${DIDIT_API_URL}/session/`, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      workflow_id: workflowId,
      vendor_data: userId,
      metadata: {
        platform: "musha",
        user_id: userId,
      },
      language: "en",
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Didit API error:", data);

    throw new Error(
      data.detail ||
        data.message ||
        "Didit verification session could not be created."
    );
  }

  return data;
}