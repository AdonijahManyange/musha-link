import { SignJWT, jwtVerify } from "jose";

const secret = process.env.SESSION_SECRET;

if (!secret) {
  throw new Error("SESSION_SECRET is not defined.");
}

const secretKey = new TextEncoder().encode(secret);

export type SessionPayload = {
  userId: string;
  role: "STUDENT" | "LANDLORD" | "ADMIN";
};

export async function createSession(
  payload: SessionPayload
) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifySession(
  token: string
) {
  try {
    const { payload } = await jwtVerify(
      token,
      secretKey
    );

    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}