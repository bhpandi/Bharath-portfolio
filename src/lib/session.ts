import { createHmac, randomBytes, timingSafeEqual } from "crypto";

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

function getSecret(): string {
  // Prefer a dedicated SESSION_SECRET; fall back to ADMIN_PASSWORD for backward compat
  const secret = process.env.SESSION_SECRET ?? process.env.ADMIN_PASSWORD;
  if (!secret || secret === "admin123") {
    // Still work in dev; log a warning
    console.warn("[session] Using default secret — set SESSION_SECRET in production.");
    return "dev-fallback-secret-set-SESSION_SECRET-in-prod";
  }
  return secret;
}

export function createSessionToken(): string {
  const nonce = randomBytes(16).toString("hex");
  const exp = Date.now() + SESSION_DURATION_MS;
  const payload = Buffer.from(JSON.stringify({ nonce, exp })).toString("base64url");
  const sig = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string): boolean {
  if (!token || typeof token !== "string") return false;

  const dotIdx = token.lastIndexOf(".");
  if (dotIdx === -1) return false;

  const payload = token.slice(0, dotIdx);
  const sig = token.slice(dotIdx + 1);

  // Compute expected signature
  const expectedSig = createHmac("sha256", getSecret()).update(payload).digest("hex");

  // Timing-safe signature comparison
  const sigBuf = Buffer.from(sig.padEnd(expectedSig.length, "0"), "hex");
  const expectedBuf = Buffer.from(expectedSig, "hex");

  let sigValid = false;
  try {
    sigValid = sig.length === expectedSig.length && timingSafeEqual(sigBuf, expectedBuf);
  } catch {
    return false;
  }

  if (!sigValid) return false;

  // Verify expiry
  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof decoded.exp === "number" && Date.now() < decoded.exp;
  } catch {
    return false;
  }
}
