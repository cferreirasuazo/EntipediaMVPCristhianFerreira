import { db } from "@/lib/db";
import { clients } from "@/lib/schema";
import { clientCreateSchema, clientUpdateSchema } from "@/lib/validators";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sql, eq } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const offset = (page - 1) * limit;

  // Total count
  const totalRes = await db
    .select({ count: sql<number>`count(*)` })
    .from(clients);

  const total = Number(totalRes[0].count);

  // Get paginated clients
  const data = await db
    .select()
    .from(clients)
    .limit(limit)
    .offset(offset)
    .orderBy(clients.id);

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = clientCreateSchema.parse(body);
    const [inserted] = await db
      .insert(clients)
      .values({
        name: parsed.name,
        type: parsed.type,
        value: parsed.value,
        since_date: parsed.since_date ? new Date(parsed.since_date) : null,
        until_date: parsed.until_date ? new Date(parsed.until_date) : null,
      })
      .returning();
    return NextResponse.json({ ok: true, data: inserted });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 400 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = clientUpdateSchema.parse(body);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateObj: any = {};
    if (parsed.name !== undefined) updateObj.name = parsed.name;
    if (parsed.type !== undefined) updateObj.type = parsed.type;
    if (parsed.value !== undefined) updateObj.value = parsed.value;
    if (parsed.since_date !== undefined)
      updateObj.since_date = parsed.since_date
        ? new Date(parsed.since_date)
        : null;
    if (parsed.until_date !== undefined)
      updateObj.until_date = parsed.until_date
        ? new Date(parsed.until_date)
        : null;

    const [updated] = await db
      .update(clients)
      .set(updateObj)
      .where(eq(clients, parsed.id))
      .returning();
    return NextResponse.json({ ok: true, data: updated });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = Number(url.searchParams.get("id"));
    if (!id)
      return NextResponse.json(
        { ok: false, error: "id required" },
        { status: 400 }
      );
    await db.delete(clients).where(eq(clients.id, id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 400 }
    );
  }
}
