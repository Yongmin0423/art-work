ALTER TABLE "commission_like" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "order_status_history" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "commission_like" CASCADE;--> statement-breakpoint
DROP TABLE "order_status_history" CASCADE;--> statement-breakpoint
ALTER TABLE "commission" RENAME COLUMN "artist_id" TO "profile_id";--> statement-breakpoint
ALTER TABLE "commission_order" RENAME COLUMN "artist_id" TO "profile_id";--> statement-breakpoint
ALTER TABLE "reviews" RENAME COLUMN "artist_id" TO "profile_id";--> statement-breakpoint
ALTER TABLE "artist_portfolio" RENAME COLUMN "artist_id" TO "profile_id";--> statement-breakpoint
ALTER TABLE "commission" DROP CONSTRAINT "commission_artist_id_profiles_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "commission_order" DROP CONSTRAINT "commission_order_artist_id_profiles_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_artist_id_profiles_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "artist_portfolio" DROP CONSTRAINT "artist_portfolio_artist_id_profiles_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "artist_portfolio" ALTER COLUMN "category" SET DATA TYPE "public"."commission_category";--> statement-breakpoint
ALTER TABLE "commission" ALTER COLUMN "category" SET DATA TYPE "public"."commission_category";--> statement-breakpoint
ALTER TABLE "commission" ADD COLUMN "images" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "commission" ADD CONSTRAINT "commission_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commission_order" ADD CONSTRAINT "commission_order_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artist_portfolio" ADD CONSTRAINT "artist_portfolio_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
-- DROP TYPE "public"."commission_category"; -- 주석처리: enum을 사용중이므로 삭제하면 안됨