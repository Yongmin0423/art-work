// ===== USERS & PROFILES =====
import {
  bigint,
  boolean,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgSchema,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { commissionCategory } from "../../common/category-enums";

const users = pgSchema("auth").table("users", {
  id: uuid().primaryKey(),
});

// 커미션 상태 enum 추가
export const commissionStatusEnum = pgEnum("commission_status", [
  "available",
  "pending",
  "unavailable",
  "paused",
]);

export const profiles = pgTable("profiles", {
  profile_id: uuid()
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  username: text().notNull().unique(),
  name: text().notNull(),
  job_title: text(),
  bio: text(),
  work_status: text().default("available").notNull(),
  location: text(),
  website: text(),
  avatar_url: text(),

  // 아티스트 전용 필드들
  specialties: text().array().default([]).notNull(), // PostgreSQL 네이티브 배열 타입!
  commission_status: commissionStatusEnum().default("available").notNull(), // 현재 커미션 받기 상태

  // 통합된 통계 (모든 유저 공통)
  followers_count: integer().notNull().default(0),
  following_count: integer().notNull().default(0),
  views_count: integer().notNull().default(0),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const follows = pgTable(
  "follows",
  {
    follower_id: uuid().references(() => profiles.profile_id, {
      onDelete: "cascade",
    }),
    following_id: uuid().references(() => profiles.profile_id, {
      onDelete: "cascade",
    }),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.follower_id, table.following_id] }),
    // 자기 자신을 팔로우하는 것을 방지하는 체크 제약 조건
    // CHECK (follower_id != following_id) - SQL 레벨에서 추가 필요
  ]
);

// ===== PORTFOLIO =====
export const artistPortfolio = pgTable("artist_portfolio", {
  profile_id: uuid()
    .primaryKey()
    .references(() => profiles.profile_id, { onDelete: "cascade" }),

  title: text().notNull(),
  description: text(),
  images: jsonb().notNull().default([]), // 이미지 URL 배열

  // 카테고리/태그로 분류
  category: commissionCategory(), // 커미션과 동일한 카테고리 enum 사용
  tags: jsonb().notNull().default([]),

  // 통계
  views_count: integer().notNull().default(0),

  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

// ===== NOTIFICATIONS & MESSAGING =====
export const notificationType = pgEnum("notification_type", [
  "follow",
  "commission_request",
  "commission_accepted",
  "commission_completed",
  "review",
  "reply",
  "mention",
  "commission_like",
  "review_like",
  "post_upvote", // 추가
  "post_reply", // 추가
]);

export const notifications = pgTable("notifications", {
  notification_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  source_id: uuid().references(() => profiles.profile_id, {
    onDelete: "cascade",
  }),
  target_id: uuid()
    .references(() => profiles.profile_id, {
      onDelete: "cascade",
    })
    .notNull(),
  type: notificationType().notNull(),

  // 참조 엔티티 ID들 (알림 종류에 따라 사용)
  reference_id: bigint({ mode: "number" }), // commission_id, review_id, post_id 등

  title: text(), // 알림 제목
  message: text(), // 알림 내용

  read: boolean().default(false).notNull(), // timestamp -> boolean으로 변경
  read_at: timestamp(), // 읽은 시간 별도 저장
  created_at: timestamp().notNull().defaultNow(),
});

export const messageRooms = pgTable("message_rooms", {
  message_room_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  room_type: text().default("direct").notNull(), // 'direct', 'group' 등
  room_name: text(), // 그룹 채팅방 이름
  created_by: uuid().references(() => profiles.profile_id, {
    onDelete: "set null",
  }),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(), // 마지막 메시지 시간 추적용
});

export const messageRoomMembers = pgTable(
  "message_room_members",
  {
    message_room_id: bigint({ mode: "number" }).references(
      () => messageRooms.message_room_id,
      {
        onDelete: "cascade",
      }
    ),
    profile_id: uuid().references(() => profiles.profile_id, {
      onDelete: "cascade",
    }),
    joined_at: timestamp().notNull().defaultNow(),
    last_read_at: timestamp(),
    is_active: boolean().default(true).notNull(), // 채팅방 나가기 기능용
  },
  (table) => [
    primaryKey({ columns: [table.message_room_id, table.profile_id] }),
  ]
);

export const messages = pgTable("messages", {
  message_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  message_room_id: bigint({ mode: "number" }).references(
    () => messageRooms.message_room_id,
    {
      onDelete: "cascade",
    }
  ),
  sender_id: uuid().references(() => profiles.profile_id, {
    onDelete: "cascade",
  }),
  content: text().notNull(),
  message_type: text().default("text").notNull(), // 'text', 'image', 'file' 등

  // 메시지 상태
  is_edited: boolean().default(false).notNull(),
  is_deleted: boolean().default(false).notNull(),

  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});
