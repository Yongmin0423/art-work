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
  pgPolicy,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { authenticatedRole, anonRole } from "drizzle-orm/supabase";
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

export const commission = pgTable(
  "commission",
  {
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
    images: jsonb().notNull().default([]), // 포트폴리오 이미지 URL 배열 (유지)

    price_start: integer().notNull(),
    price_options: jsonb().notNull().default([]),

    turnaround_days: integer().notNull(),
    revision_count: integer().notNull().default(3),
    base_size: text().default("3000x3000"),

    status: commissionStatus().notNull().default("available"),
    likes_count: integer().notNull().default(0),
    order_count: integer().notNull().default(0),
    views_count: integer().notNull().default(0),
    is_featured_weekly: boolean().notNull().default(false),

    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    // 모든 사용자가 커미션을 볼 수 있음 (공개 커미션)
    pgPolicy("commission-select-policy", {
      for: "select",
      to: anonRole,
      using: sql`true`,
    }),
    // 인증된 사용자만 커미션 생성 가능
    pgPolicy("commission-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`profile_id = auth.uid()::uuid`,
    }),
    // 커미션 작성자만 수정 가능
    pgPolicy("commission-update-policy", {
      for: "update",
      to: authenticatedRole,
      using: sql`profile_id = auth.uid()::uuid`,
      withCheck: sql`profile_id = auth.uid()::uuid`,
    }),
    // 커미션 작성자만 삭제 가능
    pgPolicy("commission-delete-policy", {
      for: "delete",
      to: authenticatedRole,
      using: sql`profile_id = auth.uid()::uuid`,
    }),
  ]
);

// ===== COMMISSION IMAGES =====
export const commissionImages = pgTable(
  "commission_images",
  {
    image_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    commission_id: bigint({ mode: "number" })
      .references(() => commission.commission_id, { onDelete: "cascade" })
      .notNull(),
    image_url: text().notNull(),
    display_order: integer().notNull().default(0),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    pgPolicy("commission-images-select-policy", {
      for: "select",
      to: anonRole,
      using: sql`true`,
    }),
    pgPolicy("commission-images-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`EXISTS (
        SELECT 1 FROM commission c 
        WHERE c.commission_id = commission_images.commission_id 
        AND c.profile_id = auth.uid()::uuid
      )`,
    }),
    pgPolicy("commission-images-update-policy", {
      for: "update",
      to: authenticatedRole,
      using: sql`EXISTS (
        SELECT 1 FROM commission c 
        WHERE c.commission_id = commission_images.commission_id 
        AND c.profile_id = auth.uid()::uuid
      )`,
      withCheck: sql`EXISTS (
        SELECT 1 FROM commission c 
        WHERE c.commission_id = commission_images.commission_id 
        AND c.profile_id = auth.uid()::uuid
      )`,
    }),
    pgPolicy("commission-images-delete-policy", {
      for: "delete",
      to: authenticatedRole,
      using: sql`EXISTS (
        SELECT 1 FROM commission c 
        WHERE c.commission_id = commission_images.commission_id 
        AND c.profile_id = auth.uid()::uuid
      )`,
    }),
  ]
);

// ===== ORDERS =====

export const commissionOrder = pgTable(
  "commission_order",
  {
    order_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
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
  },
  (table) => [
    // 주문자(클라이언트)와 아티스트만 주문을 볼 수 있음
    pgPolicy("commission-order-select-policy", {
      for: "select",
      to: authenticatedRole,
      using: sql`client_id = auth.uid()::uuid OR profile_id = auth.uid()::uuid`,
    }),
    // 인증된 사용자만 주문 생성 가능 (클라이언트로서)
    pgPolicy("commission-order-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`client_id = auth.uid()::uuid`,
    }),
    // 주문자와 아티스트만 주문 수정 가능 (상태 업데이트 등)
    pgPolicy("commission-order-update-policy", {
      for: "update",
      to: authenticatedRole,
      using: sql`client_id = auth.uid()::uuid OR profile_id = auth.uid()::uuid`,
      withCheck: sql`client_id = auth.uid()::uuid OR profile_id = auth.uid()::uuid`,
    }),
    // 주문자만 주문 삭제 가능 (주문 취소)
    pgPolicy("commission-order-delete-policy", {
      for: "delete",
      to: authenticatedRole,
      using: sql`client_id = auth.uid()::uuid`,
    }),
  ]
);
