import crypto from "crypto";

export function generateResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashResetToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

export function getResetTokenExpiration() {
  const expiration = new Date();

  expiration.setHours(expiration.getHours() + 1);

  return expiration;
}