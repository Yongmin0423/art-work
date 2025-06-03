ALTER TABLE "profiles" ALTER COLUMN "specialties" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "specialties" SET DEFAULT '{}';