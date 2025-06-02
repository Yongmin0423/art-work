// ===== COMMISSIONS =====
import {
  bigint,
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { profiles } from "../users/schema";

export const commissionStatus = pgEnum("commission_status", [
  "available",
  "pending",
  "unavailable",
  "paused", // 일시 중지 상태 추가
]);

export const commissionCategory = pgEnum("commission_category", [
  "character",
  "illustration",
  "virtual-3d",
  "live2d",
  "design",
  "video",
  "animation", // 추가
  "concept-art", // 추가
]);

export const commission = pgTable("commission", {
  commission_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  artist_id: uuid()
    .references(() => profiles.profile_id, { onDelete: "cascade" }) // cascade 추가
    .notNull(),

  title: text().notNull(),
  description: text().notNull(),
  category: commissionCategory().notNull(),
  tags: jsonb().notNull().default([]),

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

export const commissionLike = pgTable(
  "commission_like",
  {
    commission_id: bigint({ mode: "number" })
      .references(() => commission.commission_id, { onDelete: "cascade" })
      .notNull(),
    profile_id: uuid()
      .references(() => profiles.profile_id, { onDelete: "cascade" })
      .notNull(),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.commission_id, table.profile_id] })]
);

// ===== ORDERS =====
export const orderStatus = pgEnum("order_status", [
  "pending",
  "accepted",
  "in_progress",
  "revision_requested", // 수정 요청 상태 추가
  "completed",
  "cancelled",
  "refunded",
  "disputed", // 분쟁 상태 추가
]);

export const commissionOrder = pgTable("commission_order", {
  order_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  commission_id: bigint({ mode: "number" })
    .references(() => commission.commission_id, { onDelete: "restrict" }) // restrict로 변경
    .notNull(),
  client_id: uuid()
    .references(() => profiles.profile_id, { onDelete: "restrict" }) // restrict로 변경
    .notNull(),
  artist_id: uuid()
    .references(() => profiles.profile_id, { onDelete: "restrict" }) // restrict로 변경
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

// 주문 상태 변경 이력
export const orderStatusHistory = pgTable("order_status_history", {
  history_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  order_id: bigint({ mode: "number" })
    .references(() => commissionOrder.order_id, { onDelete: "cascade" })
    .notNull(),
  from_status: orderStatus(),
  to_status: orderStatus().notNull(),
  changed_by: uuid().references(() => profiles.profile_id, {
    onDelete: "set null",
  }),
  reason: text(), // 상태 변경 사유
  created_at: timestamp().notNull().defaultNow(),
});
