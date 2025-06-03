ALTER TABLE "posts" DROP CONSTRAINT "posts_topic_id_topics_topic_id_fk";
--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "topic_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "profile_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_topic_id_topics_topic_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("topic_id") ON DELETE restrict ON UPDATE no action;