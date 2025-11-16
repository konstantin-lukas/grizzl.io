import { Beat } from "#shared/enum/timer";
import { z } from "zod";

const IntervalSchema = z
    .strictObject({
        id: z.string().optional().default(""),
        title: z.nullable(z.string().max(100)).transform(value => (value === "" ? null : value)),
        repeatCount: z.int().min(1),
        duration: z
            .number()
            .min(1)
            .transform(value => Math.round(value * 1000)),
        beatPattern: z.nullable(z.array(z.enum(Beat)).min(2).max(16)),
    })
    .transform(({ id, ...rest }) => rest);

export const TimerSchema = z.strictObject({
    id: z.string().optional().default(""),
    title: z.string().min(1).max(100),
    ttsVoice: z.nullable(z.string().max(200)),
    intervals: z.array(IntervalSchema).min(1).max(100),
    createdAt: z.string().optional().default(""),
});

export type TimerInput = z.input<typeof TimerSchema>;
export type TimerOutput = z.output<typeof TimerSchema>;
