// app/api/files/[id]/download/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { files } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { downloadFile } from "@/lib/s3";
import { extractKeyFromUrl } from "@/lib/utils";

export async function GET(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;

    const [row] = await db
      .select()
      .from(files)
      .where(eq(files.id, id))
      .limit(1);

    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const key = extractKeyFromUrl(row.url);
    const fileBuffer = await downloadFile(key);

    const filename = key.split("/").pop() ?? "file";

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
