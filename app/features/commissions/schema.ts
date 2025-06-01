import {
  bigint,
  boolean,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

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

export const commission = pgTable('commission', {
  commission_id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  artist_id: bigint({ mode: 'number' }).references(() => artist.artist_id), // 추가

  name: text().notNull(),
  description: text().notNull(),
  image: jsonb().notNull().default([]),
  tags: jsonb().notNull().default([]),

  price_start: integer().notNull(),

  status: commissionStatus().notNull(),
  category: commissionCategory().notNull(),

  // 집계 필드들 (계산된 값들)
  rating_avg: numeric().default('0'), // 평균 평점
  likes_count: integer().notNull().default(0), // 좋아요 개수

  turnaround_days: integer(), // 작업 소요 기간
  revision_count: integer().default(3), // 수정 가능 횟수

  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

// 커미션 작성자/아티스트 정보
export const artist = pgTable('artist', {
  artist_id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  email: text().notNull().unique(),
  profile_image: text(),
  bio: text(),
  social_links: jsonb().default({}),
  created_at: timestamp().notNull().defaultNow(),
});

// 커미션 주문/의뢰 정보
export const commissionOrder = pgTable('commission_order', {
  order_id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  commission_id: bigint({ mode: 'number' }).references(() => commission.commission_id),
  client_id: bigint({ mode: 'number' }), // 의뢰자
  artist_id: bigint({ mode: 'number' }).references(() => artist.artist_id),
  price_agreed: integer().notNull(),
  requirements: text(),
  created_at: timestamp().notNull().defaultNow(),
  completed_at: timestamp(),
});

// 포트폴리오/샘플 작품
export const portfolio = pgTable('portfolio', {
  portfolio_id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  commission_id: bigint({ mode: 'number' }).references(() => commission.commission_id),
  image_url: text().notNull(),
  description: text(),
  is_main: boolean().default(false), // 대표 이미지 여부
  created_at: timestamp().notNull().defaultNow(),
});
