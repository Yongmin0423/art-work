ALTER TYPE "public"."notification_type" ADD VALUE 'commission_request' BEFORE 'review';--> statement-breakpoint
ALTER TYPE "public"."notification_type" ADD VALUE 'commission_accepted' BEFORE 'review';--> statement-breakpoint
ALTER TYPE "public"."notification_type" ADD VALUE 'commission_completed' BEFORE 'review';--> statement-breakpoint
CREATE TABLE "notifications" (
	"notification_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "notifications_notification_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"source_id" uuid,
	"post_id" bigint,
	"commission_id" bigint,
	"target_id" uuid NOT NULL,
	"type" "notification_type" NOT NULL,
	"read" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "message_room_members" RENAME COLUMN "created_at" TO "joined_at";--> statement-breakpoint
ALTER TABLE "profiles" RENAME COLUMN "avatar" TO "avatar_url";--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "stats" SET DEFAULT '{"followers":0,"following":0,"views":0}'::jsonb;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_following_id_pk" PRIMARY KEY("follower_id","following_id");--> statement-breakpoint
ALTER TABLE "message_room_members" ADD COLUMN "last_read_at" timestamp;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "job_title" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "work_status" text DEFAULT 'available' NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "location" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "website" text;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_source_id_profiles_profile_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_post_id_posts_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("post_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_commission_id_commission_commission_id_fk" FOREIGN KEY ("commission_id") REFERENCES "public"."commission"("commission_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_target_id_profiles_profile_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "headline";--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "role";--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "views";--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_username_unique" UNIQUE("username");--> statement-breakpoint
DROP TYPE "public"."role";