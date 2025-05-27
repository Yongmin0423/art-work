CREATE TYPE "public"."notification_type" AS ENUM('follow', 'review', 'reply', 'mention');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('developer', 'designer', 'marketer', 'founder', 'product-manager');--> statement-breakpoint
CREATE TABLE "follows" (
	"follower_id" uuid,
	"following_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message_room_members" (
	"message_room_id" bigint,
	"profile_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "message_room_members_message_room_id_profile_id_pk" PRIMARY KEY("message_room_id","profile_id")
);
--> statement-breakpoint
CREATE TABLE "message_rooms" (
	"message_room_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "message_rooms_message_room_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"message_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "messages_message_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"message_room_id" bigint,
	"sender_id" uuid,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"profile_id" uuid PRIMARY KEY NOT NULL,
	"avatar" text,
	"name" text NOT NULL,
	"username" text NOT NULL,
	"headline" text,
	"bio" text,
	"role" "role" DEFAULT 'developer' NOT NULL,
	"stats" jsonb,
	"views" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_profiles_profile_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_following_id_profiles_profile_id_fk" FOREIGN KEY ("following_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_room_members" ADD CONSTRAINT "message_room_members_message_room_id_message_rooms_message_room_id_fk" FOREIGN KEY ("message_room_id") REFERENCES "public"."message_rooms"("message_room_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_room_members" ADD CONSTRAINT "message_room_members_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_message_room_id_message_rooms_message_room_id_fk" FOREIGN KEY ("message_room_id") REFERENCES "public"."message_rooms"("message_room_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_profiles_profile_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_profile_id_users_id_fk" FOREIGN KEY ("profile_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;