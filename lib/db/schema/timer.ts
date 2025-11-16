import { createdAt, deleted, id } from "../../mixins";
import { user } from "./auth-schema";
import { char, integer, pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";

export const beatEnum = pgEnum("beat", ["pause", "low", "high"]);

export const timer = pgTable("timer", {
    ...id,
    userId: char({ length: 16 })
        .references(() => user.id, { onDelete: "cascade" })
        .notNull(),
    title: varchar({ length: 100 }).notNull(),
    ttsVoice: varchar({ length: 200 }),
    ...createdAt,
    ...deleted,
});

export const timerInterval = pgTable("timer_interval", {
    ...id,
    timerId: char({ length: 16 })
        .references(() => timer.id, { onDelete: "cascade" })
        .notNull(),
    title: varchar({ length: 100 }),
    index: integer().notNull(),
    repeatCount: integer().notNull(),
    duration: integer().notNull(),
    beatPattern: beatEnum().array(),
});
