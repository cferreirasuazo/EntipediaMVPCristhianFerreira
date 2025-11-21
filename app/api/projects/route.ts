import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { ProjectCreate } from "../../../lib/validators";
import { projects } from "@/lib/schema";
import { asc } from "drizzle-orm";
export async function GET() {
  const rows = await db
    .select()
    .from(projects)
    .orderBy(asc(projects.created_at));
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message ?? "Invalid payload" },
      { status: 400 }
    );
  }
}
