import {
  bigint,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  integer,
  type AnyPgColumn,
} from 'drizzle-orm/pg-core';
import { profiles } from '../users/schema';
import { artist, commission } from '../commissions/schema';

// 리뷰 테이블
export const reviews = pgTable('reviews', {
  review_id: bigint({ mode: 'number' })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  title: text().notNull(),
  description: text().notNull(),
  rating: integer().notNull(), // 1-5 별점
  image_url: text(), // 완성된 작품 이미지

  // 기존 commission 스키마 참조
  commission_id: bigint({ mode: 'number' }).references(
    () => commission.commission_id,
    {
      onDelete: 'cascade',
    }
  ),
  artist_id: bigint({ mode: 'number' })
    .references(() => artist.artist_id, {
      onDelete: 'cascade',
    })
    .notNull(),

  // 리뷰 작성자 (users 스키마 참조)
  reviewer_id: uuid()
    .references(() => profiles.profile_id, {
      onDelete: 'cascade',
    })
    .notNull(),

  views: integer().default(0),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

// 리뷰 좋아요 테이블
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

// 리뷰 댓글 테이블
export const reviewComments = pgTable('review_comments', {
  comment_id: bigint({ mode: 'number' })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  review_id: bigint({ mode: 'number' })
    .references(() => reviews.review_id, {
      onDelete: 'cascade',
    })
    .notNull(),
  parent_id: bigint({ mode: 'number' }).references(
    (): AnyPgColumn => reviewComments.comment_id,
    {
      onDelete: 'cascade',
    }
  ),
  profile_id: uuid()
    .references(() => profiles.profile_id, {
      onDelete: 'cascade',
    })
    .notNull(),
  comment: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

// 작가 팔로우 테이블
export const artistFollows = pgTable(
  'artist_follows',
  {
    artist_id: bigint({ mode: 'number' }).references(() => artist.artist_id, {
      onDelete: 'cascade',
    }),
    profile_id: uuid().references(() => profiles.profile_id, {
      onDelete: 'cascade',
    }),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.artist_id, table.profile_id] })]
);
