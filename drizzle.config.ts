import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: ["./app/features/**/schema.ts", "./app/common/schema.ts"],
  dialect: "postgresql",
  out: "./app/sql/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
