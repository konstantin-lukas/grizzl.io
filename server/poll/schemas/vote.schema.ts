import { id } from "../../../database/mixins";
import { ID_LENGTH, SHA_256_CHAR_COUNT } from "../../../shared/core/validators/core.validator";
import { poll } from "./poll.schema";
import { char, pgTable, smallint } from "drizzle-orm/pg-core";

export const pollVote = pgTable("poll_vote", {
    ...id,
    pollId: char({ length: ID_LENGTH })
        .references(() => poll.id, { onDelete: "cascade" })
        .notNull(),
    ipHash: char({ length: SHA_256_CHAR_COUNT }).notNull(),
    selection: smallint().array().notNull(),
});
