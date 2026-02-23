BEGIN;

DELETE FROM "timer" WHERE deleted = true;

ALTER TABLE "timer" RENAME COLUMN "deleted" TO "deleted_at";
ALTER TABLE "timer" ALTER COLUMN "deleted_at" DROP NOT NULL;
ALTER TABLE "timer" ALTER COLUMN "deleted_at" DROP DEFAULT;
ALTER TABLE "timer" ALTER COLUMN "deleted_at" TYPE timestamp USING NULL;

COMMIT;