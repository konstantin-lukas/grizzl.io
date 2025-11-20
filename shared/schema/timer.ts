import {
    BEAT_PATTERN_MAX,
    BEAT_PATTERN_MIN,
    COUNT_MIN,
    LIST_MAX,
    LIST_MIN,
    LONG_TITLE_MAX,
    TITLE_MAX,
} from "#shared/constants/data";
import { Beat } from "#shared/enum/timer";
import { DatabaseIdSchema } from "#shared/schema/id";
import { z } from "zod";

const PostIntervalSchema = z.object({
    title: z.nullable(z.string().max(TITLE_MAX)).transform(value => (value === "" ? null : value)),
    repeatCount: z.int().min(1),
    duration: z
        .number()
        .min(COUNT_MIN)
        .transform(value => Math.round(value * 1000)),
    beatPattern: z.nullable(z.array(z.enum(Beat)).min(BEAT_PATTERN_MIN).max(BEAT_PATTERN_MAX)),
});

export const PostTimerSchema = z.object({
    title: z.string().min(COUNT_MIN).max(TITLE_MAX),
    ttsVoice: z.nullable(z.string().max(LONG_TITLE_MAX)),
    intervals: z.array(PostIntervalSchema).min(LIST_MIN).max(LIST_MAX),
});

export const PutIntervalSchema = PostIntervalSchema.extend({
    id: DatabaseIdSchema.optional(),
});

export const PutTimerSchema = PostTimerSchema.omit({ intervals: true }).extend({
    intervals: z.array(PutIntervalSchema).min(LIST_MIN).max(LIST_MAX),
});

export type PostTimer = z.infer<typeof PostTimerSchema>;
export type PutTimer = z.infer<typeof PutTimerSchema>;

type Interval = z.infer<typeof PostIntervalSchema> & {
    id: string;
};

export type Timer = Omit<PostTimer, "intervals"> & {
    id: string;
    createdAt: string;
    intervals: Interval[];
};
