BEGIN;

ALTER TABLE "timer" RENAME COLUMN "tts_voice" TO "tts_voices";

ALTER TABLE "timer"
ALTER COLUMN "tts_voices" TYPE varchar(200)[] USING
    CASE
        WHEN "tts_voices" IS NULL THEN ARRAY[]::varchar(200)[]
        ELSE ARRAY["tts_voices"]
END;

ALTER TABLE "timer"
    ALTER COLUMN "tts_voices" SET NOT NULL,
ALTER COLUMN "tts_voices" SET DEFAULT ARRAY[]::varchar(200)[];

COMMIT;