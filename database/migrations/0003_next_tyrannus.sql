BEGIN;

ALTER TABLE "timer_interval" ADD COLUMN "preparation_time" integer;
UPDATE "timer_interval" SET "preparation_time" = 0;
ALTER TABLE "timer_interval" ALTER COLUMN "preparation_time" SET NOT NULL;

COMMIT;