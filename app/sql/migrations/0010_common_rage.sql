ALTER TABLE "review_comment_likes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "review_comments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "review_likes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "reviews" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "review-comment-likes-select-policy" ON "review_comment_likes" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "review-comment-likes-insert-policy" ON "review_comment_likes" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (profile_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "review-comment-likes-delete-policy" ON "review_comment_likes" AS PERMISSIVE FOR DELETE TO "authenticated" USING (profile_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "review-comments-select-policy" ON "review_comments" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "review-comments-insert-policy" ON "review_comments" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (auth.uid() IS NOT NULL);--> statement-breakpoint
CREATE POLICY "review-comments-update-policy" ON "review_comments" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (profile_id = auth.uid()::uuid) WITH CHECK (profile_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "review-comments-delete-policy" ON "review_comments" AS PERMISSIVE FOR DELETE TO "authenticated" USING (profile_id = auth.uid()::uuid OR EXISTS (
        SELECT 1 FROM profiles 
        WHERE profile_id = auth.uid()::uuid 
        AND role = 'admin'
      ));--> statement-breakpoint
CREATE POLICY "review-likes-select-policy" ON "review_likes" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "review-likes-insert-policy" ON "review_likes" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (profile_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "review-likes-delete-policy" ON "review_likes" AS PERMISSIVE FOR DELETE TO "authenticated" USING (profile_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "reviews-select-policy" ON "reviews" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "reviews-insert-policy" ON "reviews" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (reviewer_id = auth.uid()::uuid AND EXISTS (
        SELECT 1 FROM commission_order 
        WHERE order_id = reviews.order_id 
        AND client_id = auth.uid()::uuid 
        AND status = 'completed'
      ));--> statement-breakpoint
CREATE POLICY "reviews-update-policy" ON "reviews" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (reviewer_id = auth.uid()::uuid) WITH CHECK (reviewer_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "reviews-delete-policy" ON "reviews" AS PERMISSIVE FOR DELETE TO "authenticated" USING (reviewer_id = auth.uid()::uuid OR EXISTS (
        SELECT 1 FROM profiles 
        WHERE profile_id = auth.uid()::uuid 
        AND role = 'admin'
      ));