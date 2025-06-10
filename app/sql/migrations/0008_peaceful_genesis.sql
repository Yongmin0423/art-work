CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
ALTER TABLE "post_replies" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "post_reply_upvotes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "post_upvotes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "posts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "topics" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "role" "user_role" DEFAULT 'user' NOT NULL;--> statement-breakpoint
CREATE POLICY "post-replies-select-policy" ON "post_replies" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "post-replies-insert-policy" ON "post_replies" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (auth.uid() IS NOT NULL);--> statement-breakpoint
CREATE POLICY "post-replies-update-policy" ON "post_replies" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (profile_id = auth.uid()::uuid) WITH CHECK (profile_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "post-replies-delete-policy" ON "post_replies" AS PERMISSIVE FOR DELETE TO "authenticated" USING (profile_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "post-reply-upvotes-select-policy" ON "post_reply_upvotes" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "post-reply-upvotes-insert-policy" ON "post_reply_upvotes" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (profile_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "post-reply-upvotes-delete-policy" ON "post_reply_upvotes" AS PERMISSIVE FOR DELETE TO "authenticated" USING (profile_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "post-upvotes-select-policy" ON "post_upvotes" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "post-upvotes-insert-policy" ON "post_upvotes" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (profile_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "post-upvotes-delete-policy" ON "post_upvotes" AS PERMISSIVE FOR DELETE TO "authenticated" USING (profile_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "posts-select-policy" ON "posts" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "posts-insert-policy" ON "posts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (auth.uid() IS NOT NULL);--> statement-breakpoint
CREATE POLICY "posts-update-policy" ON "posts" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (profile_id = auth.uid()::uuid) WITH CHECK (profile_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "posts-delete-policy" ON "posts" AS PERMISSIVE FOR DELETE TO "authenticated" USING (profile_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "topics-select-policy" ON "topics" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "topics-insert-policy" ON "topics" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (EXISTS (
        SELECT 1 FROM profiles 
        WHERE profile_id = auth.uid()::uuid 
        AND role = 'admin'
      ));--> statement-breakpoint
CREATE POLICY "topics-update-policy" ON "topics" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (EXISTS (
        SELECT 1 FROM profiles 
        WHERE profile_id = auth.uid()::uuid 
        AND role = 'admin'
      )) WITH CHECK (EXISTS (
        SELECT 1 FROM profiles 
        WHERE profile_id = auth.uid()::uuid 
        AND role = 'admin'
      ));--> statement-breakpoint
CREATE POLICY "topics-delete-policy" ON "topics" AS PERMISSIVE FOR DELETE TO "authenticated" USING (EXISTS (
        SELECT 1 FROM profiles 
        WHERE profile_id = auth.uid()::uuid 
        AND role = 'admin'
      ));