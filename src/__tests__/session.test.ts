import { createSessionToken, verifySessionToken } from "@/lib/session";

// Use a known secret for deterministic testing
beforeEach(() => {
  process.env.SESSION_SECRET = "test-secret-for-jest-abcdef1234567890";
});

afterEach(() => {
  delete process.env.SESSION_SECRET;
});

describe("createSessionToken", () => {
  it("returns a string with exactly one dot separator", () => {
    const token = createSessionToken();
    const parts = token.split(".");
    // payload.signature — payload is base64url (no dots), sig is hex (no dots)
    expect(parts.length).toBe(2);
  });

  it("generates unique tokens each call", () => {
    const tokens = new Set(Array.from({ length: 20 }, () => createSessionToken()));
    expect(tokens.size).toBe(20);
  });

  it("contains a valid base64url payload", () => {
    const token = createSessionToken();
    const payload = token.split(".")[0];
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    expect(typeof decoded.nonce).toBe("string");
    expect(typeof decoded.exp).toBe("number");
    expect(decoded.exp).toBeGreaterThan(Date.now());
  });

  it("sets expiry ~8 hours in the future", () => {
    const before = Date.now();
    const token = createSessionToken();
    const payload = JSON.parse(Buffer.from(token.split(".")[0], "base64url").toString());
    const eightHoursMs = 8 * 60 * 60 * 1000;
    expect(payload.exp - before).toBeGreaterThanOrEqual(eightHoursMs - 1000);
    expect(payload.exp - before).toBeLessThanOrEqual(eightHoursMs + 1000);
  });
});

describe("verifySessionToken", () => {
  it("returns true for a freshly created token", () => {
    const token = createSessionToken();
    expect(verifySessionToken(token)).toBe(true);
  });

  it("returns false for empty string", () => {
    expect(verifySessionToken("")).toBe(false);
  });

  it("returns false for a random string", () => {
    expect(verifySessionToken("notavalidtoken")).toBe(false);
  });

  it("returns false for token with tampered payload", () => {
    const token = createSessionToken();
    const [, sig] = token.split(".");
    const tamperedPayload = Buffer.from(
      JSON.stringify({ nonce: "evil", exp: Date.now() + 9999999 })
    ).toString("base64url");
    expect(verifySessionToken(`${tamperedPayload}.${sig}`)).toBe(false);
  });

  it("returns false for token with tampered signature", () => {
    const token = createSessionToken();
    const [payload] = token.split(".");
    expect(verifySessionToken(`${payload}.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`)).toBe(false);
  });

  it("returns false for expired token", () => {
    const token = createSessionToken();
    const [, sig] = token.split(".");
    const expiredPayload = Buffer.from(
      JSON.stringify({ nonce: "abc", exp: Date.now() - 1000 })
    ).toString("base64url");
    // This will fail signature check too (intentional — can't forge even expired)
    expect(verifySessionToken(`${expiredPayload}.${sig}`)).toBe(false);
  });

  it("returns false when using a different secret", () => {
    const token = createSessionToken(); // signed with test-secret
    process.env.SESSION_SECRET = "completely-different-secret";
    expect(verifySessionToken(token)).toBe(false);
  });

  it("returns false for truncated token", () => {
    const token = createSessionToken();
    expect(verifySessionToken(token.slice(0, 10))).toBe(false);
  });

  it("returns false for token with extra dot segments", () => {
    const token = createSessionToken();
    expect(verifySessionToken(token + ".extra")).toBe(false);
  });
});
