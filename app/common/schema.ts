import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";

// 홈페이지 로고 이미지를 위한 테이블
export const logo = pgTable("logo", {
  logo_id: uuid("logo_id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  image_url: text("image_url").notNull(),
  alt_text: text("alt_text").notNull(),
  is_active: text("is_active").notNull().default("true"), // 현재 사용 중인 로고
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// bento-grid 카테고리 이미지들을 위한 테이블
export const category_showcase = pgTable("category_showcase", {
  showcase_id: uuid("showcase_id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  image_url: text("image_url").notNull(),
  alt_text: text("alt_text").notNull(),
  display_order: integer("display_order").notNull().default(0), // 표시 순서
  is_active: text("is_active").notNull().default("true"), // 활성화 여부
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// 타입 정의
export type Logo = typeof logo.$inferSelect;
export type NewLogo = typeof logo.$inferInsert;

export type CategoryShowcase = typeof category_showcase.$inferSelect;
export type NewCategoryShowcase = typeof category_showcase.$inferInsert;
