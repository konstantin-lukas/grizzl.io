BEGIN;

ALTER TABLE "timer" RENAME COLUMN "tts_voice" TO "tts_voices";

ALTER TABLE "timer"
ALTER COLUMN "tts_voices" TYPE varchar(500)[] USING ARRAY[]::varchar(500)[];

ALTER TABLE "timer"
    ALTER COLUMN "tts_voices" SET NOT NULL,
    ALTER COLUMN "tts_voices" SET DEFAULT ARRAY[]::varchar(500)[];

COMMIT;