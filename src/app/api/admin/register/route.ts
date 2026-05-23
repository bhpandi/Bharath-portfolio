import { NextRequest, NextResponse } from "next/server";
import { createAdminAccount, hasAdminAccount } from "@/lib/admin-auth";
import { createSessionToken } from "@/lib/session";
import { validateEmail, validatePassword, validateName } from "@/lib/validation";

const MAX_BODY = 4096;

export async function POST(req: NextRequest) {
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > MAX_BODY) {
    return NextResponse.json({ error: "Request too large." }, { status: 413 });
  }

  let body: { name?: string; email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name = "", email = "", password = "" } = body;

  const nameErr = validateName(name);
  if (nameErr) return NextResponse.json({ error: nameErr }, { status: 400 });

  const emailErr = validateEmail(email);
  if (emailErr) return NextResponse.json({ error: emailErr }, { status: 400 });

  const pwErr = validatePassword(password);
  if (pwErr) return NextResponse.json({ error: pwErr }, { status: 400 });

  if (await hasAdminAccount()) {
    return NextResponse.json({ error: "An admin account already exists." }, { status: 409 });
  }

  const result = await createAdminAccount(name, email, password);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
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
