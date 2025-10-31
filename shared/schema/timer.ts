import { Beat } from "#shared/enum/timer";
import { z } from "zod";

const IntervalSchema = z.strictObject({
    title: z.optional(z.string().max(100)).transform(value => (value === "" ? undefined : value)),
    index: z.int().min(0),
    repeatCount: z.int().min(1),
    duration: z.int().min(1),
    beatPattern: z.optional(z.array(z.enum(Beat)).min(2).max(16)),
});

export const TimerPostSchema = z.strictObject({
    title: z.string().min(1).max(100),
    ttsVoice: z.optional(z.string().max(200)),
    intervals: z.array(IntervalSchema).min(1),
});

export type TimerPostType = z.infer<typeof TimerPostSchema>;
