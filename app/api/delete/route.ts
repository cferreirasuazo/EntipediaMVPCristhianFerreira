import { NextRequest, NextResponse } from "next/server";
import { deleteFile } from "@/lib/s3";

export async function POST(req: NextRequest) {
  const { key } = await req.json();
  await deleteFile(key);
  return NextResponse.json({ success: true });
}
