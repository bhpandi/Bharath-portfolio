import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getPortfolioData, publishPortfolioData } from "@/lib/portfolio-store";
import { verifySessionToken } from "@/lib/session";
import type { PortfolioData } from "@/data/portfolio";

const MAX_BODY = 512 * 1024; // 512 KB

export async function GET() {
  const data = await getPortfolioData();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  // Verify signed session token (not just "=== 1")
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_auth")?.value ?? "";
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  // Reject oversized bodies
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > MAX_BODY) {
    return NextResponse.json({ error: "Payload too large." }, { status: 413 });
  }

  let data: PortfolioData;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const result = await publishPortfolioData(data);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/resume");

  return NextResponse.json({ ok: true, url: result.url });
}
