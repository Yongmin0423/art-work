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
} from "drizzle-orm/pg-core";
import { profiles } from "../users/schema";

export const topics = pgTable("topics", {
  topic_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  slug: text().notNull().unique(), // unique 제약 추가
  description: text(), // 토픽 설명 추가
  post_count: integer().default(0).notNull(), // 게시물 수 통계
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const posts = pgTable("posts", {
  post_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  title: text().notNull(),
  content: text().notNull(),

  // 통계 필드들
  upvotes_count: integer().default(0).notNull(),
  replies_count: integer().default(0).notNull(),
  views_count: integer().default(0).notNull(),

  // 게시물 상태
  is_pinned: boolean().default(false).notNull(), // 고정 게시물
  is_locked: boolean().default(false).notNull(), // 댓글 잠금

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
});

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
  (table) => [primaryKey({ columns: [table.post_id, table.profile_id] })]
);

export const postReplies = pgTable("post_replies", {
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
});

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
  (table) => [primaryKey({ columns: [table.post_reply_id, table.profile_id] })]
);
