import { id } from "../../mixins";
import { user } from "./auth-schema";
import { char, integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const timer = pgTable("timer", {
    ...id,
    userId: char({ length: 16 })
        .references(() => user.id, { onDelete: "cascade" })
        .notNull(),
    title: varchar({ length: 100 }).notNull(),
    ttsVoice: text(),
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
    beatPattern: integer().array().notNull().default([]),
});
