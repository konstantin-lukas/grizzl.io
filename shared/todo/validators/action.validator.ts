import { DatabaseIdSchema, preTrim } from "#shared/core/validators/core.validator";
import { z } from "zod";

export const TODO_MIN_ACTIONS = 1;
export const TODO_MAX_ACTIONS = 20;

const BaseActionSchema = z.object({
    id: DatabaseIdSchema,
    listId: DatabaseIdSchema,
});

const CreateActionSchema = BaseActionSchema.extend({
    action: z.literal("create"),
    text: preTrim(z.string()),
    index: z.number().min(0).nullable(),
});

const CheckActionSchema = BaseActionSchema.extend({
    action: z.enum(["check", "uncheck"]),
});

const MoveActionSchema = BaseActionSchema.extend({
    action: z.literal("move"),
    from: z.number(),
    to: z.number(),
});

const ScheduleActionSchema = BaseActionSchema.extend({
    action: z.literal("schedule"),
    value: z.iso.date().nullable(),
});

const DeleteActionSchema = BaseActionSchema.extend({
    action: z.literal("delete"),
});

const ChangeActionSchema = BaseActionSchema.extend({
    action: z.literal("change"),
    value: z.string(),
});

export const PostActionSchema = z.union([
    CreateActionSchema,
    CheckActionSchema,
    MoveActionSchema,
    ScheduleActionSchema,
    DeleteActionSchema,
    ChangeActionSchema,
]);

export const PostActionQueueSchema = PostActionSchema.array().min(TODO_MIN_ACTIONS).max(TODO_MAX_ACTIONS);

export type PostAction = z.infer<typeof PostActionSchema>;
export type PostActionQueue = z.infer<typeof PostActionQueueSchema>;
