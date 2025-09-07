// ===== COMMUNITY =====
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

export const topics = pgTable(
  "topics",
  {
    topic_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    name: text().notNull(),
    slug: text().notNull().unique(), // unique 제약 추가
    description: text(), // 토픽 설명 추가
    post_count: integer().default(0).notNull(), // 게시물 수 통계
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    // 모든 사용자가 토픽을 볼 수 있음
    pgPolicy("topics-select-policy", {
      for: "select",
      to: anonRole,
      using: sql`true`,
    }),
    // 관리자만 토픽 관리 가능
    pgPolicy("topics-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`EXISTS (
        SELECT 1 FROM profiles 
        WHERE profile_id = auth.uid()::uuid 
        AND role = 'admin'
      )`,
    }),
    pgPolicy("topics-update-policy", {
      for: "update",
      to: authenticatedRole,
      using: sql`EXISTS (
        SELECT 1 FROM profiles 
        WHERE profile_id = auth.uid()::uuid 
        AND role = 'admin'
      )`,
      withCheck: sql`EXISTS (
        SELECT 1 FROM profiles 
        WHERE profile_id = auth.uid()::uuid 
        AND role = 'admin'
      )`,
    }),
    pgPolicy("topics-delete-policy", {
      for: "delete",
      to: authenticatedRole,
      using: sql`EXISTS (
        SELECT 1 FROM profiles 
        WHERE profile_id = auth.uid()::uuid 
        AND role = 'admin'
      )`,
    }),
  ]
);

export const posts = pgTable(
  "posts",
  {
    post_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    title: text().notNull(),
    content: text().notNull(),

    // 통계 필드들 (trigger로 자동 관리 예정)
    upvotes_count: bigint({ mode: "number" }).default(0),
    replies_count: bigint({ mode: "number" }).default(0),

    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),

    topic_id: bigint({ mode: "number" })
      .references(() => topics.topic_id, {
        onDelete: "restrict", // 토픽이 게시물을 가지고 있으면 삭제 불가
      })
      .notNull(), // NOT NULL 추가
    profile_id: uuid()
      .references(() => profiles.profile_id, {
        onDelete: "cascade",
      })
      .notNull(), // NOT NULL 추가
  },
  (table) => [
    // 모든 사용자가 게시물을 볼 수 있음
    pgPolicy("posts-select-policy", {
      for: "select",
      to: anonRole,
      using: sql`true`,
    }),
    // 인증된 사용자만 게시물 작성 가능
    pgPolicy("posts-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`auth.uid() IS NOT NULL`,
    }),
    // 작성자만 수정/삭제 가능
    pgPolicy("posts-update-policy", {
      for: "update",
      to: authenticatedRole,
      using: sql`profile_id = auth.uid()::uuid`,
      withCheck: sql`profile_id = auth.uid()::uuid`,
    }),
    pgPolicy("posts-delete-policy", {
      for: "delete",
      to: authenticatedRole,
      using: sql`profile_id = auth.uid()::uuid`,
    }),
  ]
);

export const postUpvotes = pgTable(
  "post_upvotes",
  {
    post_id: bigint({ mode: "number" }).references(() => posts.post_id, {
      onDelete: "cascade",
    }),
    profile_id: uuid().references(() => profiles.profile_id, {
      onDelete: "cascade",
    }),
    created_at: timestamp().notNull().defaultNow(), // 생성 시간 추가
  },
  (table) => [
    primaryKey({ columns: [table.post_id, table.profile_id] }),
    // 모든 사용자가 좋아요 정보를 볼 수 있음
    pgPolicy("post-upvotes-select-policy", {
      for: "select",
      to: anonRole,
      using: sql`true`,
    }),
    // 사용자는 자신의 좋아요만 관리 가능
    pgPolicy("post-upvotes-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`profile_id = auth.uid()::uuid`,
    }),
    pgPolicy("post-upvotes-delete-policy", {
      for: "delete",
      to: authenticatedRole,
      using: sql`profile_id = auth.uid()::uuid`,
    }),
  ]
);

export const postReplies = pgTable(
  "post_replies",
  {
    post_reply_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    post_id: bigint({ mode: "number" }).references(() => posts.post_id, {
      onDelete: "cascade",
    }),
    parent_id: bigint({ mode: "number" }).references(
      (): AnyPgColumn => postReplies.post_reply_id,
      {
        onDelete: "cascade",
      }
    ),
    profile_id: uuid()
      .references(() => profiles.profile_id, {
        onDelete: "cascade",
      })
      .notNull(),
    reply: text().notNull(),

    // 대댓글 통계
    upvotes_count: integer().default(0).notNull(),
    replies_count: integer().default(0).notNull(), // 대댓글의 대댓글 수

    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    // 모든 사용자가 댓글을 볼 수 있음
    pgPolicy("post-replies-select-policy", {
      for: "select",
      to: anonRole,
      using: sql`true`,
    }),
    // 인증된 사용자만 댓글 작성 가능
    pgPolicy("post-replies-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`auth.uid() IS NOT NULL`,
    }),
    // 작성자만 수정/삭제 가능
    pgPolicy("post-replies-update-policy", {
      for: "update",
      to: authenticatedRole,
      using: sql`profile_id = auth.uid()::uuid`,
      withCheck: sql`profile_id = auth.uid()::uuid`,
    }),
    pgPolicy("post-replies-delete-policy", {
      for: "delete",
      to: authenticatedRole,
      using: sql`profile_id = auth.uid()::uuid`,
    }),
  ]
);

// 댓글 좋아요
export const postReplyUpvotes = pgTable(
  "post_reply_upvotes",
  {
    post_reply_id: bigint({ mode: "number" }).references(
      () => postReplies.post_reply_id,
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
    primaryKey({ columns: [table.post_reply_id, table.profile_id] }),
    // 모든 사용자가 댓글 좋아요 정보를 볼 수 있음
    pgPolicy("post-reply-upvotes-select-policy", {
      for: "select",
      to: anonRole,
      using: sql`true`,
    }),
    // 사용자는 자신의 좋아요만 관리 가능
    pgPolicy("post-reply-upvotes-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`profile_id = auth.uid()::uuid`,
    }),
    pgPolicy("post-reply-upvotes-delete-policy", {
      for: "delete",
      to: authenticatedRole,
      using: sql`profile_id = auth.uid()::uuid`,
    }),
  ]
);
