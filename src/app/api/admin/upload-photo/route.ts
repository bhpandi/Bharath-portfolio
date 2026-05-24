import { NextRequest, NextResponse } from "next/server";
import { put, list, del } from "@vercel/blob";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/session";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const PHOTO_PREFIX = "profile-photo";

export async function POST(req: NextRequest) {
  // Auth check
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_auth")?.value ?? "";
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided." }, { status: 400 });

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP and GIF images are allowed." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large. Maximum size is 5 MB." }, { status: 400 });
  }

  // Snapshot existing profile photos for cleanup
  const { blobs: existing } = await list({ prefix: PHOTO_PREFIX, limit: 10 });

  const ext = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
  const key = `${PHOTO_PREFIX}-${Date.now()}.${ext}`;

  const blob = await put(key, file, {
    access: "public",
    contentType: file.type,
    addRandomSuffix: false,
  });

  // Clean up old profile photos after successful upload
  if (existing.length > 0) {
    await Promise.all(existing.map((b) => del(b.url)));
  }

  return NextResponse.json({ url: blob.url });
}
