const SOVERA_API_URL =
  "https://verify.lioncapventures.com/v1";

export async function createSoveraVerificationSession(
  reference: string
) {
  const apiKey = process.env.SOVERA_API_KEY;

  if (!apiKey) {
    throw new Error("SOVERA_API_KEY is not configured");
  }

  const response = await fetch(`${SOVERA_API_URL}/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Idempotency-Key": crypto.randomUUID(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      checks: [
        "active_liveness",
        "face_match",
        "document",
      ],
      reference,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Sovera API error:", data);

    throw new Error(
      data.detail ||
        data.title ||
        "Sovera verification session could not be created."
    );
  }

  return data;
}