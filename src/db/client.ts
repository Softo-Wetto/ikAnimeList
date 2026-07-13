import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { getServerEnv } from "@/lib/env";
import * as schema from "@/db/schema";

const globalDatabase = globalThis as unknown as { sql?: ReturnType<typeof postgres> };
const environment = getServerEnv();

export const sql =
  globalDatabase.sql ??
  postgres(environment.DATABASE_URL, {
    max: environment.NODE_ENV === "production" ? 10 : 2,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false
  });

if (environment.NODE_ENV !== "production") globalDatabase.sql = sql;

export const db = drizzle(sql, { schema });
