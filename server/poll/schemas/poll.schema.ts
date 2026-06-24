import { createdAt, deletedAt, id, userId } from "../../../database/mixins";
import { LONG_TITLE_MAX, TITLE_MAX } from "../../../shared/core/validators/core.validator";
import { PollMethod, VoterIdentityMethod } from "../../../shared/poll/enums/method.enum";
import { boolean, pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const pollMethodEnum = pgEnum("poll_method", PollMethod);
export const voterIdentityMethodEnum = pgEnum("voter_identity_method", VoterIdentityMethod);

export const poll = pgTable("poll", {
    ...id,
    ...userId,
    ...createdAt,
    ...deletedAt,
    title: varchar({ length: LONG_TITLE_MAX }).notNull(),
    voterIdentityMethod: voterIdentityMethodEnum().notNull(),
    closesAt: timestamp({ withTimezone: true }),
    choices: varchar({ length: TITLE_MAX }).array().notNull(),
    method: pollMethodEnum().notNull(),
    majorityWinner: boolean().notNull(),
});
