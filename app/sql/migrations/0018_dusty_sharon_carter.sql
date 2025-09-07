ALTER TABLE "posts" ALTER COLUMN "upvotes_count" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "upvotes_count" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "replies_count" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "replies_count" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "views_count";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "is_pinned";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "is_locked";