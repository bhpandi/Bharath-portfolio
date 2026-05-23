import { validateEmail, validatePassword, validateName, passwordStrength } from "@/lib/validation";

describe("validateEmail", () => {
  it("rejects empty string", () => {
    expect(validateEmail("")).toBe("Email is required");
    expect(validateEmail("   ")).toBe("Email is required");
  });

  it("rejects missing @ symbol", () => {
    expect(validateEmail("notanemail")).not.toBe("");
  });

  it("rejects missing domain", () => {
    expect(validateEmail("user@")).not.toBe("");
  });

  it("rejects missing local part", () => {
    expect(validateEmail("@example.com")).not.toBe("");
  });

  it("rejects address over 254 characters", () => {
    const long = "a".repeat(250) + "@x.com";
    expect(validateEmail(long)).not.toBe("");
  });

  it("accepts valid email addresses", () => {
    expect(validateEmail("user@example.com")).toBe("");
    expect(validateEmail("USER@EXAMPLE.COM")).toBe("");
    expect(validateEmail("user+tag@sub.domain.com")).toBe("");
    expect(validateEmail("a@b.co")).toBe("");
  });
});

describe("validatePassword", () => {
  it("rejects empty string", () => {
    expect(validatePassword("")).toBe("Password is required");
  });

  it("rejects passwords shorter than 8 characters", () => {
    expect(validatePassword("abc")).not.toBe("");
    expect(validatePassword("1234567")).not.toBe("");
  });

  it("rejects passwords over 128 characters", () => {
    expect(validatePassword("a".repeat(129))).not.toBe("");
  });

  it("accepts passwords of 8+ characters", () => {
    expect(validatePassword("password")).toBe("");
    expect(validatePassword("a".repeat(128))).toBe("");
  });
});

describe("validateName", () => {
  it("rejects empty string", () => {
    expect(validateName("")).not.toBe("");
    expect(validateName("  ")).not.toBe("");
  });

  it("rejects single character names", () => {
    expect(validateName("A")).not.toBe("");
  });

  it("rejects names over 100 characters", () => {
    expect(validateName("A".repeat(101))).not.toBe("");
  });

  it("accepts valid names", () => {
    expect(validateName("Jane")).toBe("");
    expect(validateName("Jane Smith")).toBe("");
    expect(validateName("Jo")).toBe("");
  });
});

describe("passwordStrength", () => {
  it("scores 0 for very short passwords", () => {
    expect(passwordStrength("abc").score).toBe(0);
    expect(passwordStrength("abc").label).toBe("Very Weak");
  });

  it("scores increases with length", () => {
    const s8 = passwordStrength("abcdefgh");
    const s12 = passwordStrength("abcdefghijkl");
    expect(s12.score).toBeGreaterThan(s8.score);
  });

  it("scores increases with uppercase", () => {
    const noUpper = passwordStrength("abcdefgh");
    const withUpper = passwordStrength("Abcdefgh");
    expect(withUpper.score).toBeGreaterThan(noUpper.score);
  });

  it("scores increases with numbers", () => {
    const noNum = passwordStrength("abcdefgh");
    const withNum = passwordStrength("abcdefg1");
    expect(withNum.score).toBeGreaterThan(noNum.score);
  });

  it("scores increases with special characters", () => {
    const noSpecial = passwordStrength("abcdefgh");
    const withSpecial = passwordStrength("abcdefg!");
    expect(withSpecial.score).toBeGreaterThan(noSpecial.score);
  });

  it("reaches max score for strong passwords", () => {
    const result = passwordStrength("MyP@ssword123!Extra");
    expect(result.score).toBe(5);
    expect(result.label).toBe("Very Strong");
  });
});
