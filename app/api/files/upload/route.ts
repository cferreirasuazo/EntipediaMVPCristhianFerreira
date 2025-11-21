// app/api/files/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPresignedPutUrl } from "@/lib/s3";

export async function POST(req: NextRequest) {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
  try {
    const body = await req.json();
    if (body.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }
    const filename = String(body.filename ?? "file");
    const contentType = String(body.contentType ?? "application/octet-stream");
    if (!ALLOWED_TYPES.includes(contentType)) {
      return NextResponse.json(
        { error: "File type not allowed" },
        { status: 400 }
      );
    }
    const safeName = filename.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const key = `${Date.now()}-${safeName}`;

    const uploadUrl = await getPresignedPutUrl(key, contentType, 300);
    return NextResponse.json({ uploadUrl, key });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("POST /api/files/upload error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal" },
      { status: 500 }
    );
  }
}
