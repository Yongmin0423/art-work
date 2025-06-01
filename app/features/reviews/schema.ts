import {
  bigint,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  type AnyPgColumn,
} from 'drizzle-orm/pg-core';
import { profiles } from '../users/schema';
import { commission, commissionOrder, artist } from '../commissions/schema';

// ===== REVIEWS =====
export const reviews = pgTable('reviews', {
  review_id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),

  // 🔗 주문 완료 후 리뷰 작성 (order와 연결)
  order_id: bigint({ mode: 'number' })
    .references(() => commissionOrder.order_id, { onDelete: 'cascade' })
    .notNull()
    .unique(), // 한 주문당 하나의 리뷰만

  commission_id: bigint({ mode: 'number' })
    .references(() => commission.commission_id)
    .notNull(),
  artist_id: bigint({ mode: 'number' })
    .references(() => artist.artist_id)
    .notNull(),
  reviewer_id: uuid()
    .references(() => profiles.profile_id)
    .notNull(),

  title: text().notNull(),
  description: text().notNull(),
  rating: integer().notNull(), // 1-5
  image_url: text(), // 완성작 이미지

  views: integer().default(0),
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
    .references(() => reviews.review_id)
    .notNull(),
  parent_id: bigint({ mode: 'number' }).references((): AnyPgColumn => reviewComments.comment_id, {
    onDelete: 'cascade',
  }),
  profile_id: uuid()
    .references(() => profiles.profile_id)
    .notNull(),
  comment: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});
