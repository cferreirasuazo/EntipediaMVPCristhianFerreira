import { getPresignedPutUrl } from "@/lib/s3";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { filename, contentType } = await req.json();
  const key = `${Date.now()}-${filename}`;
  const url = await getPresignedPutUrl(key, contentType);
  return NextResponse.json({ url, key });
}
