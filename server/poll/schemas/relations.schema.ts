import { poll } from "./poll.schema";
import { pollVote } from "./vote.schema";
import { relations } from "drizzle-orm";

export const pollRelations = relations(poll, ({ many }) => ({
    votes: many(pollVote),
}));

export const pollVoteRelations = relations(pollVote, ({ one }) => ({
    poll: one(poll, {
        fields: [pollVote.pollId],
        references: [poll.id],
    }),
}));
