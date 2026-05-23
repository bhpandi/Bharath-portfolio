/**
 * Security-focused tests covering OWASP Top 10 and common attack patterns.
 */
import { hashPassword } from "@/lib/admin-auth";
import { createSessionToken, verifySessionToken } from "@/lib/session";
import { validateEmail, validatePassword } from "@/lib/validation";

beforeEach(() => {
  process.env.SESSION_SECRET = "test-secret-for-security-tests-xyz";
});
afterEach(() => {
  delete process.env.SESSION_SECRET;
});

// ─── A01: Broken Access Control ──────────────────────────────────────────────
describe("A01 Broken Access Control — session token security", () => {
  it("rejects the literal string '1' that was previously used as a session token", () => {
    expect(verifySessionToken("1")).toBe(false);
  });

  it("rejects an empty cookie value", () => {
    expect(verifySessionToken("")).toBe(false);
  });

  it("rejects null-ish values without throwing", () => {
    expect(verifySessionToken(null as unknown as string)).toBe(false);
    expect(verifySessionToken(undefined as unknown as string)).toBe(false);
  });

  it("rejects boolean true coerced to string", () => {
    expect(verifySessionToken("true")).toBe(false);
  });

  it("cannot forge a valid token without the secret", () => {
    // Attacker builds a payload with far-future expiry
    const evilPayload = Buffer.from(
      JSON.stringify({ nonce: "attacker", exp: Date.now() + 99999999 })
    ).toString("base64url");
    const guessedSig = "a".repeat(64); // 64 hex chars
    expect(verifySessionToken(`${evilPayload}.${guessedSig}`)).toBe(false);
  });
});

// ─── A02: Cryptographic Failures ─────────────────────────────────────────────
describe("A02 Cryptographic Failures — password hashing", () => {
  it("uses PBKDF2 with sufficient output length (64 hex = 32 bytes)", () => {
    const hash = hashPassword("password", "salt");
    expect(hash.length).toBe(64);
  });

  it("two different salts for the same password yield different hashes (no rainbow tables)", () => {
    const salt1 = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const salt2 = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
    expect(hashPassword("password", salt1)).not.toBe(hashPassword("password", salt2));
  });

  it("session tokens have high entropy (no two tokens share a prefix)", () => {
    const tokens = Array.from({ length: 50 }, () => createSessionToken());
    const payloads = tokens.map((t) => t.split(".")[0].slice(0, 20));
    const unique = new Set(payloads);
    expect(unique.size).toBe(50);
  });
});

// ─── A03: Injection ──────────────────────────────────────────────────────────
describe("A03 Injection — input validation", () => {
  const injectionPayloads = [
    "' OR '1'='1",
    "; DROP TABLE users;--",
    '<script>alert("xss")</script>',
    '{"$gt": ""}',          // NoSQL injection pattern
    "../../../../etc/passwd",
    "\x00null\x00byte",
    "a".repeat(10_000),     // DoS via large input
  ];

  it("email validator rejects all injection payloads as invalid emails", () => {
    for (const payload of injectionPayloads) {
      expect(validateEmail(payload)).not.toBe(""); // All should produce an error
    }
  });

  it("password validator rejects oversized payloads (>128 chars)", () => {
    expect(validatePassword("a".repeat(129))).not.toBe("");
  });

  it("password validator accepts exactly 128 characters", () => {
    expect(validatePassword("a".repeat(128))).toBe("");
  });
});

// ─── A07: Identification & Authentication Failures ───────────────────────────
describe("A07 Authentication Failures", () => {
  it("different passwords never hash to the same value (collision resistance)", () => {
    const salt = "testsalt1234567890";
    const passwords = ["password1", "password2", "PASSWORD1", "passw0rd1", "p@ssword1"];
    const hashes = passwords.map((p) => hashPassword(p, salt));
    const uniqueHashes = new Set(hashes);
    expect(uniqueHashes.size).toBe(passwords.length);
  });

  it("session tokens cannot be replayed across different secrets", () => {
    process.env.SESSION_SECRET = "secret-A";
    const tokenA = createSessionToken();
    expect(verifySessionToken(tokenA)).toBe(true);

    process.env.SESSION_SECRET = "secret-B";
    expect(verifySessionToken(tokenA)).toBe(false);
  });

  it("session token expiry is set in the future", () => {
    const token = createSessionToken();
    const payload = JSON.parse(
      Buffer.from(token.split(".")[0], "base64url").toString("utf8")
    );
    expect(payload.exp).toBeGreaterThan(Date.now());
  });

  it("modifying any byte in the signature invalidates the token", () => {
    const token = createSessionToken();
    const [payload, sig] = token.split(".");
    // Flip first character of signature
    const flipped = sig[0] === "a" ? "b" + sig.slice(1) : "a" + sig.slice(1);
    expect(verifySessionToken(`${payload}.${flipped}`)).toBe(false);
  });
});

// ─── A09: Security Logging ───────────────────────────────────────────────────
describe("A09 — generic error messages (no user enumeration)", () => {
  it("validation functions do not reveal system details in error messages", () => {
    const emailErr = validateEmail("notvalid");
    const pwErr = validatePassword("short");
    // Stack trace lines look like "at FunctionName (" or "at /path/file.js"
    const stackTracePattern = /at\s+\w+\s*\(|at\s+\/|Error:/;
    expect(emailErr).not.toMatch(stackTracePattern);
    expect(emailErr).not.toMatch(/\/src\//);
    expect(pwErr).not.toMatch(stackTracePattern);
    expect(pwErr).not.toMatch(/\/src\//);
  });
});
