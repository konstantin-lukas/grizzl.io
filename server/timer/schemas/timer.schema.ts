import { createdAt, deletedAt, id, userId } from "../../../database/mixins";
import { ID_LENGTH, LONG_STRING, TITLE_MAX } from "../../../shared/core/validators/core.validator";
import { sql } from "drizzle-orm";
import { char, integer, pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";

export const beatEnum = pgEnum("beat", ["pause", "low", "high"]);

export const timer = pgTable("timer", {
    ...id,
    ...userId,
    ...createdAt,
    ...deletedAt,
    title: varchar({ length: TITLE_MAX }).notNull(),
    ttsVoices: varchar({ length: LONG_STRING })
        .array()
        .notNull()
        .default(sql`ARRAY[]::varchar[]`),
});

export const timerInterval = pgTable("timer_interval", {
    ...id,
    timerId: char({ length: ID_LENGTH })
        .references(() => timer.id, { onDelete: "cascade" })
        .notNull(),
    title: varchar({ length: TITLE_MAX }),
    index: integer().notNull(),
    repeatCount: integer().notNull(),
    preparationTime: integer().notNull(),
    duration: integer().notNull(),
    beatPattern: beatEnum().array(),
});
