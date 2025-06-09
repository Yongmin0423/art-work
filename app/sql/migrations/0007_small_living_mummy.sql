ALTER TABLE "category_showcase" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "logo" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "category-showcase-select-policy" ON "category_showcase" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "category-showcase-insert-policy" ON "category_showcase" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "category-showcase-update-policy" ON "category_showcase" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "category-showcase-delete-policy" ON "category_showcase" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "logo-select-policy" ON "logo" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "logo-insert-policy" ON "logo" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "logo-update-policy" ON "logo" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "logo-delete-policy" ON "logo" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);