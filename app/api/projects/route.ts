import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { ProjectCreate } from "../../../lib/validators";
import { projects } from "@/lib/schema";

export async function GET() {
  const rows = await db
    .select()
    .from(projects)
    .orderBy(projects.created_at, "asc");
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ProjectCreate.parse(body);

    const [inserted] = await db
      .insert(projects)
      .values({
        name: parsed.name,
        description: parsed.description,
        status: parsed.status ?? "BACKLOG",
        priority: parsed.priority ?? "MEDIUM",
      })
      .returning();

    return NextResponse.json(inserted, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message ?? "Invalid payload" },
      { status: 400 }
    );
  }
}
