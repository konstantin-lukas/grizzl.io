import { Beat } from "#shared/enum/timer";
import { DatabaseIdSchema } from "#shared/schema/id";
import { z } from "zod";

const PostIntervalSchema = z.object({
    title: z.nullable(z.string().max(100)).transform(value => (value === "" ? null : value)),
    repeatCount: z.int().min(1),
    duration: z
        .number()
        .min(1)
        .transform(value => Math.round(value * 1000)),
    beatPattern: z.nullable(z.array(z.enum(Beat)).min(2).max(16)),
});

export const PostTimerSchema = z.object({
    title: z.string().min(1).max(100),
    ttsVoice: z.nullable(z.string().max(200)),
    intervals: z.array(PostIntervalSchema).min(1).max(100),
});

export const GetIntervalSchema = PostIntervalSchema.extend({
    id: DatabaseIdSchema,
});

export const GetTimerSchema = PostTimerSchema.omit({ intervals: true }).extend({
    id: DatabaseIdSchema,
    createdAt: z.string(),
    intervals: z.array(GetIntervalSchema).min(1).max(100),
});

export const PutIntervalSchema = PostIntervalSchema.extend({
    id: DatabaseIdSchema.optional(),
});

export const PutTimerSchema = PostTimerSchema.omit({ intervals: true }).extend({
    intervals: z.array(PutIntervalSchema).min(1).max(100),
});

export type PostTimer = z.infer<typeof PostTimerSchema>;
export type PutTimer = z.infer<typeof PutTimerSchema>;
export type GetTimer = z.infer<typeof GetTimerSchema>;
