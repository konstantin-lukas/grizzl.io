import { ID_LENGTH, LONG_TITLE_MAX, TITLE_MAX } from "../../../shared/constants/data";
import { createdAt, deleted, id } from "../../mixins";
import { user } from "./auth-schema";
import { char, integer, pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";

export const beatEnum = pgEnum("beat", ["pause", "low", "high"]);

export const timer = pgTable("timer", {
    ...id,
    userId: char({ length: ID_LENGTH })
        .references(() => user.id, { onDelete: "cascade" })
        .notNull(),
    title: varchar({ length: TITLE_MAX }).notNull(),
    ttsVoice: varchar({ length: LONG_TITLE_MAX }),
    ...createdAt,
    ...deleted,
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
