import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { ProjectUpdate } from "../../../../lib/validators";
import { projects } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const { params } = context;
    const { id } = await params; // <-- FIX

    const body = await req.json();
    const parsed = ProjectUpdate.parse(body);

    const updated = await db
      .update(projects)
      .set(parsed)
      .where(eq(projects.id, id))
      .returning();

    if (!updated.length)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(updated[0]);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message ?? "Invalid payload" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const { params } = context;
  const { id } = await params; // <-- FIX

  const deleted = await db
    .delete(projects)
    .where(eq(projects.id, id))
    .returning();

  if (!deleted.length)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ success: true });
}
