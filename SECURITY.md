# Security Assessment Report

**Date:** 2026-05-24  
**Scope:** Portfolio Builder — Admin Auth, Session Management, API Endpoints

---

## Findings & Resolutions

### CRITICAL (Fixed)

| ID | Issue | Before | After |
|----|-------|--------|-------|
| C1 | **Forgeable session cookie** | `admin_auth=1` — any request with this literal value bypassed all auth | HMAC-signed token: `base64url(payload).sha256_sig`. Cannot be forged without `SESSION_SECRET`. |
| C2 | **Timing attack — password compare** | `password === envPw` leaks timing info, enabling character-by-character brute force | `crypto.timingSafeEqual()` used throughout. |
| C3 | **Weak password hashing** | Single-round SHA-256 — GPUs can compute ~10B hashes/sec, cracking in seconds | **PBKDF2-SHA256 with 260,000 iterations** (OWASP 2023 recommendation). |

### HIGH (Fixed)

| ID | Issue | Fix |
|----|-------|-----|
| H1 | **Timing attack — email compare** | `creds.email !== email` | `timingSafeEqual(Buffer.from(a), Buffer.from(b))` |
| H2 | **Cookie missing `secure` flag** | Cookie sent over HTTP in production | `secure: process.env.NODE_ENV === "production"` |
| H3 | **No request body size limit** | Unlimited POST body could cause DoS | `Content-Length` check + 512 KB cap on portfolio publish, 4 KB cap on auth endpoints |

### MEDIUM (Fixed)

| ID | Issue | Fix |
|----|-------|-----|
| M1 | **User enumeration via error messages** | "Invalid email" vs "Invalid password" revealed which field was wrong | Generic: "Invalid credentials." |
| M2 | **No input length limits** | Fields accepted unlimited length strings | Max: email 254 chars, password 8–128 chars, name 2–100 chars |
| M3 | **Missing body parse guard** | Malformed JSON in auth endpoints caused unhandled exceptions | `try/catch` on `req.json()` with 400 response |

### LOW (Documented, Not Fixed)

| ID | Issue | Notes |
|----|-------|-------|
| L1 | **No rate limiting** | Auth endpoints accept unlimited login attempts (brute force) | Mitigated by PBKDF2 (slow hash) and strong password requirement. Proper fix: Vercel KV / Redis rate limiter. |
| L2 | **PostCSS XSS in Next.js 16** | `npm audit` reports moderate CVE in PostCSS `<8.5.10` bundled in Next.js 16.2.6 | `--force` fix would downgrade to Next.js 9 (breaking). Tracked upstream in Next.js GitHub. No user-facing impact since PostCSS runs only at build time. |
| L3 | **No CSRF token** | `sameSite: "strict"` mitigates cross-site request forgery for same-origin attacks | Acceptable for a single-admin portfolio. Upgrade path: add `X-CSRF-Token` header check. |
| L4 | **Session not revocable** | Signed tokens cannot be invalidated server-side before expiry (8h) | Mitigated by short expiry. Upgrade path: store token nonces in Vercel KV and blacklist on logout. |

---

## Test Results

```
Test Suites: 4 passed, 4 total
Tests:       69 passed, 0 failed

Coverage:
  validation.ts   100% statements, 100% branches, 100% functions
  session.ts       86% statements,  76% branches, 100% functions  
  admin-auth.ts    65% statements,  67% branches,  75% functions
  (Uncovered lines in admin-auth.ts are Vercel Blob network paths, mocked in tests)
```

### Test Suite Overview

| Suite | Tests | Covers |
|-------|-------|--------|
| `validation.test.ts` | 18 | Email, password, name validation; strength scoring |
| `session.test.ts` | 11 | Token creation, verification, expiry, tampering, secret rotation |
| `admin-auth.test.ts` | 22 | Password hashing, Blob credential lookup, legacy env var fallback |
| `security.test.ts` | 18 | OWASP A01–A09: access control, crypto failures, injection, auth failures |

---

## OWASP Top 10 Coverage

| # | Category | Status |
|---|----------|--------|
| A01 | Broken Access Control | ✅ HMAC-signed session tokens; verified on every protected request |
| A02 | Cryptographic Failures | ✅ PBKDF2-SHA256 (260k iterations); no plain-text credential storage |
| A03 | Injection | ✅ No SQL/ORM used; React escapes JSX; input length limits enforced |
| A04 | Insecure Design | ✅ Auth is stateless signed tokens; generic errors prevent enumeration |
| A05 | Security Misconfiguration | ✅ `secure`, `httpOnly`, `sameSite=strict` cookies in production |
| A06 | Vulnerable Components | ⚠️ PostCSS CVE (build-time only, tracked upstream) |
| A07 | Auth & Session Failures | ✅ Timing-safe comparisons; strong hashing; session expiry |
| A08 | Software & Data Integrity | ✅ HMAC signature on all session tokens |
| A09 | Logging Failures | ⚠️ No structured audit logging (low priority for single-admin tool) |
| A10 | SSRF | ✅ No user-controlled URLs are fetched server-side |

---

## Recommendations Before Scaling

If you scale this beyond a personal portfolio (multi-tenant SaaS):

1. **Add rate limiting** — Vercel KV with sliding window counter on auth endpoints
2. **Add audit logging** — Log all auth attempts (success/fail) with IP and timestamp to Vercel Log Drains
3. **Add CSRF tokens** — For forms that modify state
4. **Make sessions revocable** — Store nonces in Vercel KV; blacklist on sign-out
5. **Add 2FA** — TOTP via `otplib` for high-security deployments
