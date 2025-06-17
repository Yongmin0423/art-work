CREATE TABLE "commission_likes" (
	"like_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "commission_likes_like_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"commission_id" bigint NOT NULL,
	"liker_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "commission_likes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "commission" ADD COLUMN "images" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "commission_likes" ADD CONSTRAINT "commission_likes_commission_id_commission_commission_id_fk" FOREIGN KEY ("commission_id") REFERENCES "public"."commission"("commission_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commission_likes" ADD CONSTRAINT "commission_likes_liker_id_profiles_profile_id_fk" FOREIGN KEY ("liker_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "commission-likes-select-policy-anon" ON "commission_likes" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "commission-likes-select-policy-auth" ON "commission_likes" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "commission-likes-insert-policy" ON "commission_likes" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (liker_id = auth.uid()::uuid);--> statement-breakpoint
CREATE POLICY "commission-likes-delete-policy" ON "commission_likes" AS PERMISSIVE FOR DELETE TO "authenticated" USING (liker_id = auth.uid()::uuid);