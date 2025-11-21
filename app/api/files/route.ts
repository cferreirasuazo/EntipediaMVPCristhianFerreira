// app/api/files/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { files } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { getPresignedGetUrl } from "@/lib/s3";

export async function GET() {
  try {
    const list = await db.select().from(files).orderBy(desc(files.createdAt));
    // attach fresh presigned downloadUrl to each row
    const withUrls = await Promise.all(
      list.map(async (row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        type: row.type,
        size: Number(row.size),
        key: row.key,
        s3Url: row.url,
        createdAt: row.createdAt,
        downloadUrl: await getPresignedGetUrl(row.key, 300),
      }))
    );
    return NextResponse.json(withUrls);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("GET /api/files error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Expect: { key, name, description, type, size }
    const key = String(body.key);
    if (!key)
      return NextResponse.json({ error: "key required" }, { status: 400 });

    const name = String(body.name ?? "");
    const description = body.description ?? null;
    const type = String(body.type ?? "application/octet-stream");
    const size = typeof body.size === "number" ? BigInt(body.size) : BigInt(0);

    // build a canonical S3 URL (stored for convenience)
    const s3Url = `https://${process.env.S3_BUCKET}.s3.${
      process.env.AWS_REGION
    }.amazonaws.com/${encodeURIComponent(key)}`;

    // insert into Postgres
    const inserted = await db
      .insert(files)
      .values({
        name,
        description,
        type,
        size,
        key,
        url: s3Url,
      })
      .returning();

    return NextResponse.json(inserted[0]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("POST /api/files error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal" },
      { status: 500 }
    );
  }
}
