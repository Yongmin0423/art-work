-- 먼저 nullable로 컬럼 추가
ALTER TABLE "category_showcase" ADD COLUMN "storage_path" text;--> statement-breakpoint

-- 기존 데이터가 있다면 임시 값으로 업데이트 (실제 사용 시에는 proper path로 변경 필요)
UPDATE "category_showcase" SET "storage_path" = 'temp-path/' || LOWER(REPLACE(title, ' ', '-')) || '.jpg' WHERE "storage_path" IS NULL;--> statement-breakpoint

-- 이제 NOT NULL 제약 조건 추가
ALTER TABLE "category_showcase" ALTER COLUMN "storage_path" SET NOT NULL;--> statement-breakpoint

-- 기존 image_url 컬럼 삭제
ALTER TABLE "category_showcase" DROP COLUMN "image_url";