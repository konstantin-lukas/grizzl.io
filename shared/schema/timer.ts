import { Beat } from "#shared/enum/timer";
import { z } from "zod";

const IntervalSchema = z.strictObject({
    title: z.optional(z.string().max(100)),
    index: z.int().min(0),
    repeatCount: z.int().min(1),
    duration: z.int().min(1),
    beatPattern: z.array(z.enum(Beat)).max(16),
});

export const TimerPostSchema = z.strictObject({
    title: z.string().max(100),
    ttsVoice: z.optional(z.string().max(200)),
    intervals: z.array(IntervalSchema).min(1),
});
