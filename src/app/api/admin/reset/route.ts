// TEMPORARY — delete this file after use
import { NextRequest, NextResponse } from "next/server";
import { del, list } from "@vercel/blob";

const RESET_SECRET = process.env.RESET_SECRET ?? "";

export async function POST(req: NextRequest) {
  const { secret } = await req.json().catch(() => ({ secret: "" }));
  if (!RESET_SECRET || secret !== RESET_SECRET) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  const { blobs } = await list({ prefix: "admin-credentials", limit: 1 });
  if (!blobs.length) {
    return NextResponse.json({ ok: true, message: "No credentials blob found." });
  }
  await del(blobs[0].url);
  return NextResponse.json({ ok: true, message: "Admin credentials deleted." });
}
