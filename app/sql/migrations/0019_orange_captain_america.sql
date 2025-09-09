ALTER TABLE "commission_order" DROP CONSTRAINT "commission_order_commission_id_commission_commission_id_fk";
--> statement-breakpoint
ALTER TABLE "commission_order" ADD CONSTRAINT "commission_order_commission_id_commission_commission_id_fk" FOREIGN KEY ("commission_id") REFERENCES "public"."commission"("commission_id") ON DELETE cascade ON UPDATE no action;