// ===== REVIEWS =====
import {
  bigint,
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  type AnyPgColumn,
  pgPolicy,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { authenticatedRole, anonRole } from "drizzle-orm/supabase";
import { profiles } from "../users/schema";
import { commission, commissionOrder } from "../commissions/schema";

export const reviews = pgTable(
  "reviews",
  {
    review_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),

    // 🔗 주문 완료 후 리뷰 작성 (order와 연결)
    order_id: bigint({ mode: "number" })
      .references(() => commissionOrder.order_id, { onDelete: "cascade" })
      .notNull()
      .unique(), // 한 주문당 하나의 리뷰만

    commission_id: bigint({ mode: "number" })
      .references(() => commission.commission_id, { onDelete: "cascade" })
      .notNull(),
    profile_id: uuid()
      .references(() => profiles.profile_id, { onDelete: "cascade" })
      .notNull(),
    reviewer_id: uuid()
      .references(() => profiles.profile_id, { onDelete: "cascade" })
      .notNull(),

    title: text().notNull(),
    description: text().notNull(),
    rating: integer().notNull(), // 1-5
    image_url: text().notNull(), // 완성작 이미지 - required로 변경

    // 통계
    likes_count: integer().default(0).notNull(), // views -> likes_count 이름 통일
    views_count: integer().default(0).notNull(), // views -> views_count 이름 통일

    // 리뷰 상태
    is_featured: boolean().default(false).notNull(), // 대표 리뷰 여부

    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    // 모든 사용자가 리뷰를 볼 수 있음
    pgPolicy("reviews-select-policy", {
      for: "select",
      to: anonRole,
      using: sql`true`,
    }),
    pgPolicy("reviews-select-policy-auth", {
      for: "select",
      to: authenticatedRole,
      using: sql`true`,
    }),
    // 주문한 클라이언트만 리뷰 작성 가능
    pgPolicy("reviews-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`reviewer_id = auth.uid()::uuid AND EXISTS (
        SELECT 1 FROM commission_order 
        WHERE order_id = reviews.order_id 
        AND client_id = auth.uid()::uuid 
        AND status = 'completed'
      )`,
    }),
    // 리뷰 작성자만 수정 가능
    pgPolicy("reviews-update-policy", {
      for: "update",
      to: authenticatedRole,
      using: sql`reviewer_id = auth.uid()::uuid`,
      withCheck: sql`reviewer_id = auth.uid()::uuid`,
    }),
    // 리뷰 작성자나 관리자만 삭제 가능
    pgPolicy("reviews-delete-policy", {
      for: "delete",
      to: authenticatedRole,
      using: sql`reviewer_id = auth.uid()::uuid OR EXISTS (
        SELECT 1 FROM profiles 
        WHERE profile_id = auth.uid()::uuid 
        AND role = 'admin'
      )`,
    }),
  ]
);

export const reviewLikes = pgTable(
  "review_likes",
  {
    review_id: bigint({ mode: "number" }).references(() => reviews.review_id, {
      onDelete: "cascade",
    }),
    profile_id: uuid().references(() => profiles.profile_id, {
      onDelete: "cascade",
    }),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.review_id, table.profile_id] }),
    // 모든 사용자가 리뷰 좋아요 정보를 볼 수 있음
    pgPolicy("review-likes-select-policy", {
      for: "select",
      to: anonRole,
      using: sql`true`,
    }),
    // 인증된 사용자만 좋아요 가능 (본인의 좋아요만)
    pgPolicy("review-likes-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`profile_id = auth.uid()::uuid`,
    }),
    // 본인의 좋아요만 취소 가능
    pgPolicy("review-likes-delete-policy", {
      for: "delete",
      to: authenticatedRole,
      using: sql`profile_id = auth.uid()::uuid`,
    }),
  ]
);

export const reviewComments = pgTable(
  "review_comments",
  {
    comment_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    review_id: bigint({ mode: "number" })
      .references(() => reviews.review_id, { onDelete: "cascade" })
      .notNull(),
    parent_id: bigint({ mode: "number" }).references(
      (): AnyPgColumn => reviewComments.comment_id,
      {
        onDelete: "cascade",
      }
    ),
    profile_id: uuid()
      .references(() => profiles.profile_id, { onDelete: "cascade" })
      .notNull(),
    comment: text().notNull(),

    // 댓글 통계
    likes_count: integer().default(0).notNull(),

    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    // 모든 사용자가 리뷰 댓글을 볼 수 있음
    pgPolicy("review-comments-select-policy", {
      for: "select",
      to: anonRole,
      using: sql`true`,
    }),
    // 인증된 사용자만 댓글 작성 가능
    pgPolicy("review-comments-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`auth.uid() IS NOT NULL`,
    }),
    // 댓글 작성자만 수정 가능
    pgPolicy("review-comments-update-policy", {
      for: "update",
      to: authenticatedRole,
      using: sql`profile_id = auth.uid()::uuid`,
      withCheck: sql`profile_id = auth.uid()::uuid`,
    }),
    // 댓글 작성자나 관리자만 삭제 가능
    pgPolicy("review-comments-delete-policy", {
      for: "delete",
      to: authenticatedRole,
      using: sql`profile_id = auth.uid()::uuid OR EXISTS (
        SELECT 1 FROM profiles 
        WHERE profile_id = auth.uid()::uuid 
        AND role = 'admin'
      )`,
    }),
  ]
);

// 리뷰 댓글 좋아요
export const reviewCommentLikes = pgTable(
  "review_comment_likes",
  {
    comment_id: bigint({ mode: "number" }).references(
      () => reviewComments.comment_id,
      {
        onDelete: "cascade",
      }
    ),
    profile_id: uuid().references(() => profiles.profile_id, {
      onDelete: "cascade",
    }),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.comment_id, table.profile_id] }),
    // 모든 사용자가 댓글 좋아요 정보를 볼 수 있음
    pgPolicy("review-comment-likes-select-policy", {
      for: "select",
      to: anonRole,
      using: sql`true`,
    }),
    // 인증된 사용자만 댓글 좋아요 가능 (본인의 좋아요만)
    pgPolicy("review-comment-likes-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`profile_id = auth.uid()::uuid`,
    }),
    // 본인의 댓글 좋아요만 취소 가능
    pgPolicy("review-comment-likes-delete-policy", {
      for: "delete",
      to: authenticatedRole,
      using: sql`profile_id = auth.uid()::uuid`,
    }),
  ]
);
