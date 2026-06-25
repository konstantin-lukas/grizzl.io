import { LONG_TITLE_MAX, TITLE_MAX, TITLE_MIN, preTrim } from "#shared/core/validators/core.validator";
import { PollMethod, VoterIdentityMethod } from "#shared/poll/enums/method.enum";
import { z } from "zod";

export const MIN_POLL_CHOICES = 2 as const;
export const MAX_POLL_CHOICES = 20 as const;

export const PostPollSchema = z.object({
    title: preTrim(z.string().min(TITLE_MIN).max(LONG_TITLE_MAX)),
    voterIdentityMethod: z.enum(VoterIdentityMethod),
    closesAt: z.iso
        .datetime()
        .transform(date => new Date(date))
        .refine(date => date.getTime() - Date.now() > 3 * 60 * 1000)
        .nullable(),
    choices: preTrim(z.string().min(TITLE_MIN).max(TITLE_MAX)).array().min(MIN_POLL_CHOICES).max(MAX_POLL_CHOICES),
    method: z.enum(PollMethod),
    majorityWinner: z.boolean(),
});

export type PostPoll = z.infer<typeof PostPollSchema>;
