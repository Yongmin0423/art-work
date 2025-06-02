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
} from 'drizzle-orm/pg-core';
import { profiles } from '../users/schema';
import { commission, commissionOrder } from '../commissions/schema';

export const reviews = pgTable('reviews', {
  review_id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),

  // 🔗 주문 완료 후 리뷰 작성 (order와 연결)
  order_id: bigint({ mode: 'number' })
    .references(() => commissionOrder.order_id, { onDelete: 'cascade' })
    .notNull()
    .unique(), // 한 주문당 하나의 리뷰만

  commission_id: bigint({ mode: 'number' })
    .references(() => commission.commission_id, { onDelete: 'cascade' })
    .notNull(),
  artist_id: uuid()
    .references(() => profiles.profile_id, { onDelete: 'cascade' })
    .notNull(),
  reviewer_id: uuid()
    .references(() => profiles.profile_id, { onDelete: 'cascade' })
    .notNull(),

  title: text().notNull(),
  description: text().notNull(),
  rating: integer().notNull(), // 1-5
  image_url: text(), // 완성작 이미지

  // 통계
  likes_count: integer().default(0).notNull(), // views -> likes_count 이름 통일
  views_count: integer().default(0).notNull(), // views -> views_count 이름 통일

  // 리뷰 상태
  is_featured: boolean().default(false).notNull(), // 대표 리뷰 여부

  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const reviewLikes = pgTable(
  'review_likes',
  {
    review_id: bigint({ mode: 'number' }).references(() => reviews.review_id, {
      onDelete: 'cascade',
    }),
    profile_id: uuid().references(() => profiles.profile_id, {
      onDelete: 'cascade',
    }),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.review_id, table.profile_id] })]
);

export const reviewComments = pgTable('review_comments', {
  comment_id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  review_id: bigint({ mode: 'number' })
    .references(() => reviews.review_id, { onDelete: 'cascade' })
    .notNull(),
  parent_id: bigint({ mode: 'number' }).references((): AnyPgColumn => reviewComments.comment_id, {
    onDelete: 'cascade',
  }),
  profile_id: uuid()
    .references(() => profiles.profile_id, { onDelete: 'cascade' })
    .notNull(),
  comment: text().notNull(),

  // 댓글 통계
  likes_count: integer().default(0).notNull(),

  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

// 리뷰 댓글 좋아요
export const reviewCommentLikes = pgTable(
  'review_comment_likes',
  {
    comment_id: bigint({ mode: 'number' }).references(() => reviewComments.comment_id, {
      onDelete: 'cascade',
    }),
    profile_id: uuid().references(() => profiles.profile_id, {
      onDelete: 'cascade',
    }),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.comment_id, table.profile_id] })]
);
