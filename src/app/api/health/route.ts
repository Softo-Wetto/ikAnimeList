import { sql as query } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();
  try {
    await db.execute(query`select 1 as ok`);
    return NextResponse.json({ status: "ok", database: "reachable", responseMs: Date.now() - startedAt }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    logger.error("health.database_unreachable", { message: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ status: "degraded", database: "unreachable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
