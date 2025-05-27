CREATE TYPE "public"."commission_category" AS ENUM('character', 'illustration', 'virtual-3d', 'live2d', 'design', 'video');--> statement-breakpoint
CREATE TYPE "public"."commission_status" AS ENUM('available', 'pending', 'unavailable');--> statement-breakpoint
CREATE TABLE "artist" (
	"artist_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "artist_artist_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"email" text NOT NULL,
	"profile_image" text,
	"bio" text,
	"social_links" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "artist_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "commission" (
	"commission_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "commission_commission_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"artist_id" bigint,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"image" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"price_start" integer NOT NULL,
	"price_end" integer,
	"currency" text DEFAULT 'USD' NOT NULL,
	"status" "commission_status" NOT NULL,
	"category" "commission_category" NOT NULL,
	"rating_avg" numeric DEFAULT '0',
	"rating_count" integer DEFAULT 0 NOT NULL,
	"likes_count" integer DEFAULT 0 NOT NULL,
	"turnaround_days" integer,
	"revision_count" integer DEFAULT 3,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "commission_order" (
	"order_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "commission_order_order_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"commission_id" bigint,
	"client_id" bigint,
	"artist_id" bigint,
	"price_agreed" integer NOT NULL,
	"requirements" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "portfolio" (
	"portfolio_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "portfolio_portfolio_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"commission_id" bigint,
	"image_url" text NOT NULL,
	"description" text,
	"is_main" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "commission" ADD CONSTRAINT "commission_artist_id_artist_artist_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artist"("artist_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commission_order" ADD CONSTRAINT "commission_order_commission_id_commission_commission_id_fk" FOREIGN KEY ("commission_id") REFERENCES "public"."commission"("commission_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commission_order" ADD CONSTRAINT "commission_order_artist_id_artist_artist_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artist"("artist_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio" ADD CONSTRAINT "portfolio_commission_id_commission_commission_id_fk" FOREIGN KEY ("commission_id") REFERENCES "public"."commission"("commission_id") ON DELETE no action ON UPDATE no action;