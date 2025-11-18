// app/api/files/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { files } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { deleteFile } from "@/lib/s3";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const numericId = Number(id); // FIX #1

    const record = await db
      .select()
      .from(files)
      .where(eq(files.id, numericId))
      .limit(1);

    if (!record || record.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const row = record[0];

    // Delete file from S3 using your actual function name
    await deleteFile(row.key); // FIX #2

    // Delete metadata row
    await db.delete(files).where(eq(files.id, numericId));

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("DELETE /api/files/[id] error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal" },
      { status: 500 }
    );
  }
}
