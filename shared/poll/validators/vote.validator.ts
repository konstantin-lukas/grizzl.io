import { z } from "zod";

export const SCORE_VOTE_MIN_POINTS = 1;
export const SCORE_VOTE_MAX_POINTS = 10;

export const PostVoteSchema = z.object({
    selection: z.int().min(0).array(),
});

export type PostVote = z.infer<typeof PostVoteSchema>;
