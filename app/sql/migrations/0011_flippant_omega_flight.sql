ALTER TABLE "commission" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "commission_order" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "commission-select-policy" ON "commission" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "commission-insert-policy" ON "commission" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (profile_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "commission-update-policy" ON "commission" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (profile_id = auth.uid()::uuid) WITH CHECK (profile_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "commission-delete-policy" ON "commission" AS PERMISSIVE FOR DELETE TO "authenticated" USING (profile_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "commission-order-select-policy" ON "commission_order" AS PERMISSIVE FOR SELECT TO "authenticated" USING (client_id = auth.uid()::uuid OR profile_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "commission-order-insert-policy" ON "commission_order" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (client_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "commission-order-update-policy" ON "commission_order" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (client_id = auth.uid()::uuid OR profile_id = auth.uid()::uuid) WITH CHECK (client_id = auth.uid()::uuid OR profile_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "commission-order-delete-policy" ON "commission_order" AS PERMISSIVE FOR DELETE TO "authenticated" USING (client_id = auth.uid()::uuid);