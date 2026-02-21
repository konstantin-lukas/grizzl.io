import { Beat } from "#shared/features/timer/enums/beat.enum";
import {
    COUNT_MAX,
    COUNT_MIN,
    DatabaseIdSchema,
    LIST_MAX,
    LIST_MIN,
    LONG_STRING,
    SHA_1_CHAR_COUNT,
    TITLE_MAX,
    TITLE_MIN,
    ZERO,
} from "#shared/validators/core.validator";
import { z } from "zod";

export const BEAT_PATTERN_MIN = 2;
export const BEAT_PATTERN_MAX = 30;
export const TIMER_DURATION_MIN = 1000;
export const TIMER_DURATION_MAX = 3600000; // 60 * 60 * 1000

const PostIntervalSchema = z.object({
    title: z.nullable(z.string().max(TITLE_MAX)).transform(value => (value === "" ? null : value)),
    repeatCount: z.int().min(COUNT_MIN).max(COUNT_MAX),
    duration: z.int().min(TIMER_DURATION_MIN).max(TIMER_DURATION_MAX),
    preparationTime: z.int().min(ZERO).max(TIMER_DURATION_MAX),
    beatPattern: z.nullable(z.array(z.enum(Beat)).min(BEAT_PATTERN_MIN).max(BEAT_PATTERN_MAX)),
});

export const PostTimerSchema = z.object({
    title: z.string().min(TITLE_MIN).max(TITLE_MAX),
    ttsVoices: z
        .array(
            z
                .string()
                .regex(/^[0-9a-fA-F]{40}.+/)
                .min(SHA_1_CHAR_COUNT)
                .max(LONG_STRING),
        )
        .max(LIST_MAX),
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
