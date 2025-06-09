// ===== COMMISSIONS =====
import {
  bigint,
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { profiles } from "../users/schema";
import { commissionCategory } from "../../common/category-enums";

export const commissionStatus = pgEnum("commission_status", [
  "available",
  "pending",
  "unavailable",
  "paused",
]);

// ===== ORDERS =====
export const orderStatus = pgEnum("order_status", [
  "pending",
  "accepted",
  "in_progress",
  "revision_requested",
  "completed",
  "cancelled",
  "refunded",
  "disputed",
]);

export const commission = pgTable("commission", {
  commission_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  profile_id: uuid()
    .references(() => profiles.profile_id, { onDelete: "cascade" })
    .notNull(),

  title: text().notNull(),
  description: text().notNull(),
  category: commissionCategory().notNull(),
  tags: jsonb().notNull().default([]),
  images: jsonb().notNull().default([]), // 포트폴리오 이미지 URL 배열

  price_start: integer().notNull(),
  price_options: jsonb().notNull().default([]),

  turnaround_days: integer().notNull(),
  revision_count: integer().notNull().default(3),
  base_size: text().default("3000x3000"),

  status: commissionStatus().notNull().default("available"),
  likes_count: integer().notNull().default(0),
  order_count: integer().notNull().default(0),
  views_count: integer().notNull().default(0),

  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

// ===== ORDERS =====

export const commissionOrder = pgTable("commission_order", {
  order_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  commission_id: bigint({ mode: "number" })
    .references(() => commission.commission_id, { onDelete: "restrict" })
    .notNull(),
  client_id: uuid()
    .references(() => profiles.profile_id, { onDelete: "restrict" })
    .notNull(),
  profile_id: uuid()
    .references(() => profiles.profile_id, { onDelete: "restrict" })
    .notNull(),

  selected_options: jsonb().notNull().default([]),
  total_price: integer().notNull(),
  requirements: text(),

  // 추가 필드들
  deadline: timestamp(), // 마감일
  revision_count_used: integer().default(0).notNull(), // 사용된 수정 횟수
  final_image_url: text(), // 최종 완성작 이미지

  status: orderStatus().notNull().default("pending"),

  created_at: timestamp().notNull().defaultNow(),
  accepted_at: timestamp(), // 수락 시간
  started_at: timestamp(), // 작업 시작 시간
  completed_at: timestamp(),
  updated_at: timestamp().notNull().defaultNow(),
});
