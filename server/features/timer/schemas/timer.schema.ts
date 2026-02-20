import { ID_LENGTH, LONG_TITLE_MAX, TITLE_MAX } from "../../../../shared/validators/core.validator";
import { createdAt, deletedAt, id } from "../../../database/mixins";
import { user } from "../../../schemas/auth.schema";
import { sql } from "drizzle-orm";
import { char, integer, pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";

export const beatEnum = pgEnum("beat", ["pause", "low", "high"]);

export const timer = pgTable("timer", {
    ...id,
    userId: char({ length: ID_LENGTH })
        .references(() => user.id, { onDelete: "cascade" })
        .notNull(),
    title: varchar({ length: TITLE_MAX }).notNull(),
    ttsVoices: varchar({ length: LONG_TITLE_MAX })
        .array()
        .notNull()
        .default(sql`ARRAY[]::varchar[]`),
    ...createdAt,
    ...deletedAt,
});

export const timerInterval = pgTable("timer_interval", {
    ...id,
    timerId: char({ length: ID_LENGTH })
        .references(() => timer.id, { onDelete: "cascade" })
        .notNull(),
    title: varchar({ length: TITLE_MAX }),
    index: integer().notNull(),
    repeatCount: integer().notNull(),
    duration: integer().notNull(),
    beatPattern: beatEnum().array(),
});
