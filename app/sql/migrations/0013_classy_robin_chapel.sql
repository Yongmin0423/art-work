CREATE TABLE "commission_images" (
	"image_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "commission_images_image_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"commission_id" bigint NOT NULL,
	"image_url" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "commission_images" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "commission_images" ADD CONSTRAINT "commission_images_commission_id_commission_commission_id_fk" FOREIGN KEY ("commission_id") REFERENCES "public"."commission"("commission_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commission" DROP COLUMN "images";--> statement-breakpoint
CREATE POLICY "commission-images-select-policy" ON "commission_images" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "commission-images-insert-policy" ON "commission_images" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (EXISTS (
        SELECT 1 FROM commission c 
        WHERE c.commission_id = commission_images.commission_id 
        AND c.profile_id = auth.uid()::uuid
      ));--> statement-breakpoint
CREATE POLICY "commission-images-update-policy" ON "commission_images" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (EXISTS (
        SELECT 1 FROM commission c 
        WHERE c.commission_id = commission_images.commission_id 
        AND c.profile_id = auth.uid()::uuid
      )) WITH CHECK (EXISTS (
        SELECT 1 FROM commission c 
        WHERE c.commission_id = commission_images.commission_id 
        AND c.profile_id = auth.uid()::uuid
      ));--> statement-breakpoint
CREATE POLICY "commission-images-delete-policy" ON "commission_images" AS PERMISSIVE FOR DELETE TO "authenticated" USING (EXISTS (
        SELECT 1 FROM commission c 
        WHERE c.commission_id = commission_images.commission_id 
        AND c.profile_id = auth.uid()::uuid
      ));