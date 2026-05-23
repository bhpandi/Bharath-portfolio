import { hashPassword, isBlobConfigured, verifyAdminCredentials } from "@/lib/admin-auth";

// Mock @vercel/blob to avoid real network calls
jest.mock("@vercel/blob", () => ({
  put: jest.fn().mockResolvedValue({ url: "https://blob.test/admin-credentials.json" }),
  list: jest.fn().mockResolvedValue({ blobs: [] }),
}));

// Mock fetch used by getAdminCredentials
global.fetch = jest.fn();

describe("hashPassword", () => {
  it("produces a hex string", () => {
    const hash = hashPassword("mypassword", "somesalt");
    expect(typeof hash).toBe("string");
    expect(/^[0-9a-f]+$/.test(hash)).toBe(true);
  });

  it("produces consistent output for same inputs", () => {
    const hash1 = hashPassword("testpass", "saltsalt");
    const hash2 = hashPassword("testpass", "saltsalt");
    expect(hash1).toBe(hash2);
  });

  it("produces different output for different passwords", () => {
    const hash1 = hashPassword("password1", "saltsalt");
    const hash2 = hashPassword("password2", "saltsalt");
    expect(hash1).not.toBe(hash2);
  });

  it("produces different output for different salts", () => {
    const hash1 = hashPassword("password", "salt1111");
    const hash2 = hashPassword("password", "salt2222");
    expect(hash1).not.toBe(hash2);
  });

  it("does not produce the input password in output", () => {
    const hash = hashPassword("supersecret", "randomsalt");
    expect(hash).not.toContain("supersecret");
  });

  it("produces a long hash (key_length * 2 hex chars = 64)", () => {
    const hash = hashPassword("pass", "salt");
    expect(hash.length).toBe(64); // 32 bytes = 64 hex chars
  });

  it("salt affects output significantly", () => {
    const results = new Set([
      hashPassword("password", "salt1"),
      hashPassword("password", "salt2"),
      hashPassword("password", "salt3"),
    ]);
    expect(results.size).toBe(3);
  });
});

describe("isBlobConfigured", () => {
  it("returns false when BLOB_READ_WRITE_TOKEN is not set", () => {
    delete process.env.BLOB_READ_WRITE_TOKEN;
    expect(isBlobConfigured()).toBe(false);
  });

  it("returns true when BLOB_READ_WRITE_TOKEN is set", () => {
    process.env.BLOB_READ_WRITE_TOKEN = "test_token";
    expect(isBlobConfigured()).toBe(true);
    delete process.env.BLOB_READ_WRITE_TOKEN;
  });
});

describe("verifyAdminCredentials — legacy ADMIN_PASSWORD fallback", () => {
  beforeEach(() => {
    // No blob account (list returns empty)
    const { list } = require("@vercel/blob");
    list.mockResolvedValue({ blobs: [] });
    process.env.ADMIN_PASSWORD = "SecureAdminPw1!";
  });

  afterEach(() => {
    delete process.env.ADMIN_PASSWORD;
  });

  it("returns true for correct ADMIN_PASSWORD", async () => {
    const result = await verifyAdminCredentials("", "SecureAdminPw1!");
    expect(result).toBe(true);
  });

  it("returns false for wrong password", async () => {
    const result = await verifyAdminCredentials("", "wrongpassword");
    expect(result).toBe(false);
  });

  it("returns false for empty password", async () => {
    const result = await verifyAdminCredentials("", "");
    expect(result).toBe(false);
  });

  it("returns false for password with extra characters", async () => {
    const result = await verifyAdminCredentials("", "SecureAdminPw1!extra");
    expect(result).toBe(false);
  });

  it("is case-sensitive", async () => {
    const result = await verifyAdminCredentials("", "secureadminpw1!");
    expect(result).toBe(false);
  });
});

describe("verifyAdminCredentials — with stored Blob credentials", () => {
  const testEmail = "admin@example.com";
  const testPassword = "MyS3cur3P@ss!";
  const testSalt = "abc123def456abc123def456abc123de";

  beforeEach(() => {
    // isBlobConfigured() checks this env var — must be set so we hit the Blob path
    process.env.BLOB_READ_WRITE_TOKEN = "test_blob_token";
    const { list } = require("@vercel/blob");
    const storedHash = hashPassword(testPassword, testSalt);

    // Simulate blob returning credentials
    list.mockResolvedValue({
      blobs: [{ url: "https://blob.test/admin-credentials.json" }],
    });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        email: testEmail,
        passwordHash: storedHash,
        salt: testSalt,
        algorithm: "pbkdf2-sha256",
        iterations: 260_000,
      }),
    });
  });

  afterEach(() => {
    delete process.env.BLOB_READ_WRITE_TOKEN;
  });

  it("returns true for correct email and password", async () => {
    const result = await verifyAdminCredentials(testEmail, testPassword);
    expect(result).toBe(true);
  });

  it("returns false for wrong password", async () => {
    const result = await verifyAdminCredentials(testEmail, "wrongpassword");
    expect(result).toBe(false);
  });

  it("returns false for wrong email", async () => {
    const result = await verifyAdminCredentials("other@example.com", testPassword);
    expect(result).toBe(false);
  });

  it("returns false for both wrong", async () => {
    const result = await verifyAdminCredentials("wrong@x.com", "wrongpass");
    expect(result).toBe(false);
  });

  it("is case-insensitive for email (normalised to lowercase)", async () => {
    const result = await verifyAdminCredentials("ADMIN@EXAMPLE.COM", testPassword);
    expect(result).toBe(true);
  });

  it("is case-sensitive for password", async () => {
    const result = await verifyAdminCredentials(testEmail, testPassword.toUpperCase());
    expect(result).toBe(false);
  });
});
