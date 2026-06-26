import { z } from "zod";

export const PostVoteSchema = z.object({
    selection: z.int().min(0).array(),
});

export type PostVote = z.infer<typeof PostVoteSchema>;
