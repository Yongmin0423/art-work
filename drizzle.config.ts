import { defineConfig } from "drizzle-kit";

//drizzle-kit이 마이그레이션 파일을 생성할 때 사용하는 설정 파일
export default defineConfig({
  schema: ["./app/features/**/schema.ts", "./app/common/schema.ts"],
  dialect: "postgresql",
  out: "./app/sql/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
