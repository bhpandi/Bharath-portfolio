import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCredentials, hasAdminAccount } from "@/lib/admin-auth";
import { createSessionToken } from "@/lib/session";

const MAX_BODY = 4096; // bytes

export async function POST(req: NextRequest) {
  // Reject oversized bodies early
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > MAX_BODY) {
    return NextResponse.json({ error: "Request too large." }, { status: 413 });
  }

  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { email = "", password = "" } = body;

  if (!password?.trim()) {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }

  const accountExists = await hasAdminAccount();
  if (accountExists && !email?.trim()) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const valid = await verifyAdminCredentials(email, password);

  // Generic error — don't reveal which field was wrong (prevents user enumeration)
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const token = createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_auth", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
  return res;
}
