// app/api/files/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPresignedPutUrl } from "@/lib/s3";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const filename = String(body.filename ?? "file");
    const contentType = String(body.contentType ?? "application/octet-stream");

    const safeName = filename.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const key = `${Date.now()}-${safeName}`;

    const uploadUrl = await getPresignedPutUrl(key, contentType, 300);
    return NextResponse.json({ uploadUrl, key });
  } catch (err: any) {
    console.error("POST /api/files/upload error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal" },
      { status: 500 }
    );
  }
}
