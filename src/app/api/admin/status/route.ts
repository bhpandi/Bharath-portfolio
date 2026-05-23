import { NextResponse } from "next/server";
import { hasAdminAccount, isBlobConfigured } from "@/lib/admin-auth";

export async function GET() {
  const blobConfigured = isBlobConfigured();
  const hasAccount = blobConfigured ? await hasAdminAccount() : false;
  return NextResponse.json({ hasAccount, blobConfigured });
}
