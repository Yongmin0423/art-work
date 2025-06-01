import {
  bigint,
  boolean,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { profiles } from '../users/schema';

// ===== ARTISTS & COMMISSIONS =====
export const commissionStatus = pgEnum('commission_status', [
  'available',
  'pending',
  'unavailable',
]);

export const commissionCategory = pgEnum('commission_category', [
  'character',
  'illustration',
  'virtual-3d',
  'live2d',
  'design',
  'video',
]);

export const orderStatus = pgEnum('order_status', [
  'pending',
  'accepted',
  'in_progress',
  'completed',
  'cancelled',
  'refunded',
]);

// 🔗 Artist는 Profile의 확장 (아티스트로 활동하는 사용자)
export const artist = pgTable('artist', {
  artist_id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  profile_id: uuid()
    .references(() => profiles.profile_id, { onDelete: 'cascade' })
    .notNull()
    .unique(), // 🔗 핵심 연결점

  // 아티스트 전용 정보
  portfolio_description: text(),
  social_links: jsonb().default({}),

  // 아티스트 전체 통계
  total_likes: integer().notNull().default(0),
  avg_rating: numeric().default('0'),
  total_orders: integer().notNull().default(0),
  total_followers: integer().notNull().default(0),

  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const commission = pgTable('commission', {
  commission_id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  artist_id: bigint({ mode: 'number' })
    .references(() => artist.artist_id)
    .notNull(),

  title: text().notNull(),
  description: text().notNull(),
  category: commissionCategory().notNull(),
  tags: jsonb().notNull().default([]),

  price_start: integer().notNull(),
  price_options: jsonb().notNull().default([]),

  turnaround_days: integer().notNull(),
  revision_count: integer().notNull().default(3),
  base_size: text().default('3000x3000'),

  status: commissionStatus().notNull().default('available'),
  likes_count: integer().notNull().default(0),
  rating_avg: numeric().default('0'),
  order_count: integer().notNull().default(0),
  views_count: integer().notNull().default(0),

  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const commissionImage = pgTable('commission_image', {
  image_id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  commission_id: bigint({ mode: 'number' })
    .references(() => commission.commission_id)
    .notNull(),
  image_url: text().notNull(),
  description: text(),
  is_main: boolean().default(false),
  display_order: integer().default(0),
  created_at: timestamp().notNull().defaultNow(),
});

export const commissionOrder = pgTable('commission_order', {
  order_id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  commission_id: bigint({ mode: 'number' })
    .references(() => commission.commission_id)
    .notNull(),
  client_id: uuid()
    .references(() => profiles.profile_id)
    .notNull(), // 🔗 일반 사용자가 주문
  artist_id: bigint({ mode: 'number' })
    .references(() => artist.artist_id)
    .notNull(),

  selected_options: jsonb().notNull().default([]),
  total_price: integer().notNull(),
  requirements: text(),

  status: orderStatus().notNull().default('pending'),

  created_at: timestamp().notNull().defaultNow(),
  completed_at: timestamp(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const commissionLike = pgTable(
  'commission_like',
  {
    commission_id: bigint({ mode: 'number' })
      .references(() => commission.commission_id)
      .notNull(),
    profile_id: uuid()
      .references(() => profiles.profile_id)
      .notNull(), // 🔗 일반 사용자가 좋아요
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.commission_id, table.profile_id] })]
);
