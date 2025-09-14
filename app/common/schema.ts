import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  pgPolicy,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { authenticatedRole, anonRole } from "drizzle-orm/supabase";

// 홈페이지 로고 이미지를 위한 테이블
export const logo = pgTable(
  "logo",
  {
    logo_id: uuid("logo_id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    image_url: text("image_url").notNull(),
    alt_text: text("alt_text").notNull(),
    is_active: text("is_active").notNull().default("true"), // 현재 사용 중인 로고
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    // 모든 사용자가 로고를 볼 수 있음 (홈페이지 표시용)
    pgPolicy("logo-select-policy", {
      for: "select",
      to: anonRole,
      using: sql`true`,
    }),
    // 인증된 사용자만 로고 관리 가능 (향후 관리자 역할로 제한 가능)
    pgPolicy("logo-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`true`,
    }),
    pgPolicy("logo-update-policy", {
      for: "update",
      to: authenticatedRole,
      using: sql`true`,
      withCheck: sql`true`,
    }),
    pgPolicy("logo-delete-policy", {
      for: "delete",
      to: authenticatedRole,
      using: sql`true`,
    }),
  ]
);

// bento-grid 카테고리 이미지들을 위한 테이블
export const category_showcase = pgTable(
  "category_showcase",
  {
    showcase_id: uuid("showcase_id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    storage_path: text("storage_path").notNull(), // Supabase Storage에서의 파일 경로
    alt_text: text("alt_text").notNull(),
    display_order: integer("display_order").notNull().default(0), // 표시 순서
    is_active: text("is_active").notNull().default("true"), // 활성화 여부
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    // 모든 사용자가 카테고리 쇼케이스를 볼 수 있음 (홈페이지 표시용)
    pgPolicy("category-showcase-select-policy", {
      for: "select",
      to: anonRole,
      using: sql`true`,
    }),
    // 인증된 사용자만 카테고리 쇼케이스 관리 가능 (향후 관리자 역할로 제한 가능)
    pgPolicy("category-showcase-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`true`,
    }),
    pgPolicy("category-showcase-update-policy", {
      for: "update",
      to: authenticatedRole,
      using: sql`true`,
      withCheck: sql`true`,
    }),
    pgPolicy("category-showcase-delete-policy", {
      for: "delete",
      to: authenticatedRole,
      using: sql`true`,
    }),
  ]
);

// 타입 정의
export type Logo = typeof logo.$inferSelect;
export type NewLogo = typeof logo.$inferInsert;

export type CategoryShowcase = typeof category_showcase.$inferSelect;
export type NewCategoryShowcase = typeof category_showcase.$inferInsert;
