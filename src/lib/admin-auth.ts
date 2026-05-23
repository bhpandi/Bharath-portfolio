import { put, list } from "@vercel/blob";
import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";

// OWASP-recommended: PBKDF2-SHA256 with 260,000 iterations
const ITERATIONS = 260_000;
const KEY_LENGTH = 32;
const DIGEST = "sha256";

interface AdminCredentials {
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  algorithm: "pbkdf2-sha256";
  iterations: number;
}

const CRED_KEY = "admin-credentials.json";

export function isBlobConfigured(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

export async function getAdminCredentials(): Promise<AdminCredentials | null> {
  if (!isBlobConfigured()) return null;
  try {
    const { blobs } = await list({ prefix: "admin-credentials", limit: 1 });
    if (!blobs.length) return null;
    const res = await fetch(blobs[0].url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as AdminCredentials;
  } catch {
    return null;
  }
}

export async function hasAdminAccount(): Promise<boolean> {
  return (await getAdminCredentials()) !== null;
}

export function hashPassword(
  password: string,
  salt: string,
  iterations = ITERATIONS
): string {
  return pbkdf2Sync(password, salt, iterations, KEY_LENGTH, DIGEST).toString("hex");
}

function timingSafeHexEqual(a: string, b: string): boolean {
  try {
    const aBuf = Buffer.from(a, "hex");
    const bBuf = Buffer.from(b, "hex");
    if (aBuf.length !== bBuf.length) {
      // Always run comparison to prevent length-based timing oracle
      timingSafeEqual(aBuf, Buffer.alloc(aBuf.length));
      return false;
    }
    return timingSafeEqual(aBuf, bBuf);
  } catch {
    return false;
  }
}

function timingSafeStringEqual(a: string, b: string): boolean {
  try {
    const aBuf = Buffer.from(a, "utf8");
    const bBuf = Buffer.from(b, "utf8");
    if (aBuf.length !== bBuf.length) {
      timingSafeEqual(aBuf, Buffer.alloc(aBuf.length));
      return false;
    }
    return timingSafeEqual(aBuf, bBuf);
  } catch {
    return false;
  }
}

export async function createAdminAccount(
  name: string,
  email: string,
  password: string
): Promise<{ ok: boolean; error?: string }> {
  if (!isBlobConfigured()) {
    return {
      ok: false,
      error:
        "Vercel Blob is not configured. Add BLOB_READ_WRITE_TOKEN in Vercel → Settings → Environment Variables.",
    };
  }

  const existing = await getAdminCredentials();
  if (existing) {
    return { ok: false, error: "An admin account already exists." };
  }

  const salt = randomBytes(32).toString("hex");
  const credentials: AdminCredentials = {
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash: hashPassword(password, salt),
    salt,
    algorithm: "pbkdf2-sha256",
    iterations: ITERATIONS,
  };

  await put(CRED_KEY, JSON.stringify(credentials), {
    access: "public",
    addRandomSuffix: false,
  });

  return { ok: true };
}

export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<boolean> {
  const creds = await getAdminCredentials();

  if (creds) {
    // Always compute hash first (prevents timing oracle on email check)
    const hash = hashPassword(password, creds.salt, creds.iterations ?? ITERATIONS);
    const emailMatch = timingSafeStringEqual(email.toLowerCase().trim(), creds.email);
    const hashMatch = timingSafeHexEqual(hash, creds.passwordHash);
    return emailMatch && hashMatch;
  }

  // Fallback: plain ADMIN_PASSWORD env var (timing-safe)
  const envPw = process.env.ADMIN_PASSWORD ?? "admin123";
  return timingSafeStringEqual(password, envPw);
}
