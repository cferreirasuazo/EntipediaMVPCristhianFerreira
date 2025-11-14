import { NextResponse } from "next/server";
import { listFiles } from "@/lib/s3";

export async function GET() {
  const items = await listFiles();
  return NextResponse.json(items);
}
