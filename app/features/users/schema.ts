import {
  bigint,
  jsonb,
  pgEnum,
  pgSchema,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { commission, commissionOrder } from '../commissions/schema';
import { posts } from '../community/schema';
import { reviews } from '../reviews/schema';

// ===== USERS & PROFILES =====
const users = pgSchema('auth').table('users', {
  id: uuid().primaryKey(),
});

export const profiles = pgTable('profiles', {
  profile_id: uuid()
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  username: text().notNull().unique(),
  name: text().notNull(),
  job_title: text(),
  bio: text(),
  work_status: text().default('available').notNull(),
  location: text(),
  website: text(),
  avatar_url: text(),
  stats: jsonb()
    .$type<{
      followers: number;
      following: number;
      views: number;
    }>()
    .default({ followers: 0, following: 0, views: 0 }),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const follows = pgTable(
  'follows',
  {
    follower_id: uuid().references(() => profiles.profile_id, {
      onDelete: 'cascade',
    }),
    following_id: uuid().references(() => profiles.profile_id, {
      onDelete: 'cascade',
    }),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.follower_id, table.following_id] })]
);

// ===== NOTIFICATIONS & MESSAGING =====
export const notificationType = pgEnum('notification_type', [
  'follow',
  'artist_follow',
  'commission_request',
  'commission_accepted',
  'commission_completed',
  'review',
  'reply',
  'mention',
  'commission_like',
  'review_like',
]);

export const notifications = pgTable('notifications', {
  notification_id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  source_id: uuid().references(() => profiles.profile_id, {
    onDelete: 'cascade',
  }),
  post_id: bigint({ mode: 'number' }).references(() => posts.post_id, {
    onDelete: 'cascade',
  }),
  commission_id: bigint({ mode: 'number' }).references(() => commission.commission_id, {
    onDelete: 'cascade',
  }),
  order_id: bigint({ mode: 'number' }).references(() => commissionOrder.order_id, {
    onDelete: 'cascade',
  }),
  review_id: bigint({ mode: 'number' }).references(() => reviews.review_id, {
    onDelete: 'cascade',
  }),
  target_id: uuid()
    .references(() => profiles.profile_id, {
      onDelete: 'cascade',
    })
    .notNull(),
  type: notificationType().notNull(),
  read: timestamp(),
  created_at: timestamp().notNull().defaultNow(),
});

export const messageRooms = pgTable('message_rooms', {
  message_room_id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  // 🔗 커미션 관련 대화방인 경우
  commission_id: bigint({ mode: 'number' }).references(() => commission.commission_id),
  order_id: bigint({ mode: 'number' }).references(() => commissionOrder.order_id),
  created_at: timestamp().notNull().defaultNow(),
});

export const messageRoomMembers = pgTable(
  'message_room_members',
  {
    message_room_id: bigint({ mode: 'number' }).references(() => messageRooms.message_room_id, {
      onDelete: 'cascade',
    }),
    profile_id: uuid().references(() => profiles.profile_id, {
      onDelete: 'cascade',
    }),
    joined_at: timestamp().notNull().defaultNow(),
    last_read_at: timestamp(),
  },
  (table) => [primaryKey({ columns: [table.message_room_id, table.profile_id] })]
);

export const messages = pgTable('messages', {
  message_id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  message_room_id: bigint({ mode: 'number' }).references(() => messageRooms.message_room_id, {
    onDelete: 'cascade',
  }),
  sender_id: uuid().references(() => profiles.profile_id, {
    onDelete: 'cascade',
  }),
  content: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
});
