import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://ikanime:ikanime@localhost:5432/ikanimelist"
  },
  strict: true,
  verbose: true
});
