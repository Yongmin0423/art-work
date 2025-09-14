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
  pgPolicy,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { authenticatedRole, anonRole } from "drizzle-orm/supabase";
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

// 사용자 역할 enum 추가
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const profiles = pgTable(
  "profiles",
  {
    profile_id: uuid()
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    username: text().notNull().unique(),
    name: text().notNull(),
    job_title: text(),
    short_intro: text(), // 10자 내외 간단 소개 (layout에 표시)
    bio: text(), // 상세 자기소개 (profile-page에 표시)
    work_status: text().default("available").notNull(),
    location: text(),
    website: text(),
    avatar_url: text(),

    // 사용자 역할 (기본값은 일반 사용자)
    role: userRoleEnum().default("user").notNull(),

    // 아티스트 전용 필드들
    specialties: text().array().default([]).notNull(), // PostgreSQL 네이티브 배열 타입!
    commission_status: commissionStatusEnum().default("available").notNull(), // 현재 커미션 받기 상태

    // 통합된 통계 (모든 유저 공통)
    followers_count: integer().notNull().default(0),
    following_count: integer().notNull().default(0),
    views_count: integer().notNull().default(0),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    // 모든 사용자가 프로필을 볼 수 있음
    pgPolicy("profiles-select-policy", {
      for: "select",
      to: anonRole,
      using: sql`true`,
    }),
    // 인증된 사용자만 프로필 생성 가능
    pgPolicy("profiles-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`profile_id = auth.uid()::uuid`,
    }),
    // 본인 프로필만 수정 가능
    pgPolicy("profiles-update-policy", {
      for: "update",
      to: authenticatedRole,
      using: sql`profile_id = auth.uid()::uuid`,
      withCheck: sql`profile_id = auth.uid()::uuid`,
    }),
    // 본인 프로필만 삭제 가능
    pgPolicy("profiles-delete-policy", {
      for: "delete",
      to: authenticatedRole,
      using: sql`profile_id = auth.uid()::uuid`,
    }),
  ]
);

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
    // 모든 사용자가 팔로우 관계를 볼 수 있음
    pgPolicy("follows-select-policy", {
      for: "select",
      to: anonRole,
      using: sql`true`,
    }),
    // 인증된 사용자만 팔로우 가능 (본인이 팔로우하는 경우)
    pgPolicy("follows-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`follower_id = auth.uid()::uuid`,
    }),
    // 본인이 팔로우한 것만 삭제 가능 (언팔로우)
    pgPolicy("follows-delete-policy", {
      for: "delete",
      to: authenticatedRole,
      using: sql`follower_id = auth.uid()::uuid`,
    }),
    // 자기 자신을 팔로우하는 것을 방지하는 체크 제약 조건
    // CHECK (follower_id != following_id) - SQL 레벨에서 추가 필요
  ]
);

// ===== PORTFOLIO =====
export const artistPortfolio = pgTable(
  "artist_portfolio",
  {
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
  },
  (table) => [
    // 모든 사용자가 포트폴리오를 볼 수 있음
    pgPolicy("artist-portfolio-select-policy", {
      for: "select",
      to: anonRole,
      using: sql`true`,
    }),
    // 본인의 포트폴리오만 생성 가능
    pgPolicy("artist-portfolio-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`profile_id = auth.uid()::uuid`,
    }),
    // 본인의 포트폴리오만 수정 가능
    pgPolicy("artist-portfolio-update-policy", {
      for: "update",
      to: authenticatedRole,
      using: sql`profile_id = auth.uid()::uuid`,
      withCheck: sql`profile_id = auth.uid()::uuid`,
    }),
    // 본인의 포트폴리오만 삭제 가능
    pgPolicy("artist-portfolio-delete-policy", {
      for: "delete",
      to: authenticatedRole,
      using: sql`profile_id = auth.uid()::uuid`,
    }),
  ]
);

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

export const notifications = pgTable(
  "notifications",
  {
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
  },
  (table) => [
    // 본인의 알림만 볼 수 있음
    pgPolicy("notifications-select-policy", {
      for: "select",
      to: authenticatedRole,
      using: sql`target_id = auth.uid()::uuid`,
    }),
    // 시스템이나 인증된 사용자가 알림 생성 가능
    pgPolicy("notifications-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`auth.uid() IS NOT NULL`,
    }),
    // 본인의 알림만 수정 가능 (읽음 상태 변경 등)
    pgPolicy("notifications-update-policy", {
      for: "update",
      to: authenticatedRole,
      using: sql`target_id = auth.uid()::uuid`,
      withCheck: sql`target_id = auth.uid()::uuid`,
    }),
    // 본인의 알림만 삭제 가능
    pgPolicy("notifications-delete-policy", {
      for: "delete",
      to: authenticatedRole,
      using: sql`target_id = auth.uid()::uuid`,
    }),
  ]
);

export const messageRooms = pgTable(
  "message_rooms",
  {
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
  },
  (table) => [
    // 채팅방 멤버만 볼 수 있음
    pgPolicy("message-rooms-select-policy", {
      for: "select",
      to: authenticatedRole,
      using: sql`EXISTS (
        SELECT 1 FROM message_room_members 
        WHERE message_room_id = message_rooms.message_room_id 
        AND profile_id = auth.uid()::uuid 
        AND is_active = true
      )`,
    }),
    // 인증된 사용자만 채팅방 생성 가능
    pgPolicy("message-rooms-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`auth.uid() IS NOT NULL`,
    }),
    // 채팅방 생성자나 관리자만 수정 가능
    pgPolicy("message-rooms-update-policy", {
      for: "update",
      to: authenticatedRole,
      using: sql`created_by = auth.uid()::uuid OR EXISTS (
        SELECT 1 FROM profiles 
        WHERE profile_id = auth.uid()::uuid 
        AND role = 'admin'
      )`,
      withCheck: sql`created_by = auth.uid()::uuid OR EXISTS (
        SELECT 1 FROM profiles 
        WHERE profile_id = auth.uid()::uuid 
        AND role = 'admin'
      )`,
    }),
    // 채팅방 생성자나 관리자만 삭제 가능
    pgPolicy("message-rooms-delete-policy", {
      for: "delete",
      to: authenticatedRole,
      using: sql`created_by = auth.uid()::uuid OR EXISTS (
        SELECT 1 FROM profiles 
        WHERE profile_id = auth.uid()::uuid 
        AND role = 'admin'
      )`,
    }),
  ]
);

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
    // 같은 채팅방의 활성 멤버들만 볼 수 있음
    pgPolicy("message-room-members-select-policy", {
      for: "select",
      to: authenticatedRole,
      using: sql`EXISTS (
        SELECT 1 FROM message_room_members mrm 
        WHERE mrm.message_room_id = message_room_members.message_room_id 
        AND mrm.profile_id = auth.uid()::uuid 
        AND mrm.is_active = true
      )`,
    }),
    // 채팅방 생성자나 본인만 멤버 추가 가능
    pgPolicy("message-room-members-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`profile_id = auth.uid()::uuid OR EXISTS (
        SELECT 1 FROM message_rooms 
        WHERE message_room_id = message_room_members.message_room_id 
        AND created_by = auth.uid()::uuid
      )`,
    }),
    // 본인의 멤버십만 수정 가능 (마지막 읽음 시간 등)
    pgPolicy("message-room-members-update-policy", {
      for: "update",
      to: authenticatedRole,
      using: sql`profile_id = auth.uid()::uuid`,
      withCheck: sql`profile_id = auth.uid()::uuid`,
    }),
    // 본인의 멤버십만 삭제 가능 (채팅방 나가기)
    pgPolicy("message-room-members-delete-policy", {
      for: "delete",
      to: authenticatedRole,
      using: sql`profile_id = auth.uid()::uuid`,
    }),
  ]
);

export const messages = pgTable(
  "messages",
  {
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
  },
  (table) => [
    // 채팅방 멤버만 메시지를 볼 수 있음
    pgPolicy("messages-select-policy", {
      for: "select",
      to: authenticatedRole,
      using: sql`EXISTS (
        SELECT 1 FROM message_room_members 
        WHERE message_room_id = messages.message_room_id 
        AND profile_id = auth.uid()::uuid 
        AND is_active = true
      )`,
    }),
    // 채팅방 멤버만 메시지 전송 가능
    pgPolicy("messages-insert-policy", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`sender_id = auth.uid()::uuid AND EXISTS (
        SELECT 1 FROM message_room_members 
        WHERE message_room_id = messages.message_room_id 
        AND profile_id = auth.uid()::uuid 
        AND is_active = true
      )`,
    }),
    // 메시지 발신자만 수정 가능 (편집)
    pgPolicy("messages-update-policy", {
      for: "update",
      to: authenticatedRole,
      using: sql`sender_id = auth.uid()::uuid`,
      withCheck: sql`sender_id = auth.uid()::uuid`,
    }),
    // 메시지 발신자나 관리자만 삭제 가능
    pgPolicy("messages-delete-policy", {
      for: "delete",
      to: authenticatedRole,
      using: sql`sender_id = auth.uid()::uuid OR EXISTS (
        SELECT 1 FROM profiles 
        WHERE profile_id = auth.uid()::uuid 
        AND role = 'admin'
      )`,
    }),
  ]
);
