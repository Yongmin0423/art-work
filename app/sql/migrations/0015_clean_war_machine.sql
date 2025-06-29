ALTER TABLE "commission" ALTER COLUMN "status" SET DEFAULT 'pending_approval';--> statement-breakpoint
ALTER TABLE "commission" ADD COLUMN "approved_by" uuid;--> statement-breakpoint
ALTER TABLE "commission" ADD COLUMN "approved_at" timestamp;--> statement-breakpoint
ALTER TABLE "commission" ADD COLUMN "rejection_reason" text;--> statement-breakpoint
ALTER TABLE "commission" ADD CONSTRAINT "commission_approved_by_profiles_profile_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."profiles"("profile_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER POLICY "commission-update-policy" ON "commission" TO authenticated USING (profile_id = auth.uid()::uuid OR EXISTS (
        SELECT 1 FROM profiles 
        WHERE profile_id = auth.uid()::uuid 
        AND role = 'admin'
      )) WITH CHECK (profile_id = auth.uid()::uuid OR EXISTS (
        SELECT 1 FROM profiles 
        WHERE profile_id = auth.uid()::uuid 
        AND role = 'admin'
      ));