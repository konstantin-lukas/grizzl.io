import { createdAt, deletedAt, id, userId } from "../../../database/mixins";
import { LONG_TITLE_MAX, TITLE_MAX } from "../../../shared/core/validators/core.validator";
import { PollMethod } from "../../../shared/poll/enums/method.enum";
import { boolean, pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const pollTypeEnum = pgEnum("poll_method", PollMethod);

export const poll = pgTable("poll", {
    ...id,
    ...userId,
    ...createdAt,
    ...deletedAt,
    title: varchar({ length: LONG_TITLE_MAX }).notNull(),
    closesAt: timestamp({ withTimezone: true }).notNull(),
    choices: varchar({ length: TITLE_MAX }).array().notNull(),
    method: pollTypeEnum().notNull(),
    majorityWinner: boolean().notNull(),
});
