import { DatabaseIdSchema, preTrim } from "#shared/core/validators/core.validator";
import { z } from "zod";

export const TODO_MIN_ACTIONS = 1;
export const TODO_MAX_ACTIONS = 20;

const BaseActionSchema = z.object({
    id: DatabaseIdSchema,
    listId: DatabaseIdSchema,
});

export const CreateActionSchema = BaseActionSchema.extend({
    action: z.literal("create"),
    text: preTrim(z.string()),
    index: z.number().min(0).nullable(),
});

export const CheckActionSchema = BaseActionSchema.extend({
    action: z.literal("check"),
});

export const MoveActionSchema = BaseActionSchema.extend({
    action: z.literal("move"),
    from: z.number(),
    to: z.number(),
});

export const ScheduleActionSchema = BaseActionSchema.extend({
    action: z.literal("schedule"),
    value: z.iso.date().nullable(),
});

export const DeleteActionSchema = BaseActionSchema.extend({
    action: z.literal("delete"),
});

export const ChangeActionSchema = BaseActionSchema.extend({
    action: z.literal("change"),
    value: preTrim(z.string()),
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
export type CreateAction = z.infer<typeof CreateActionSchema>;
export type CheckAction = z.infer<typeof CheckActionSchema>;
export type MoveAction = z.infer<typeof MoveActionSchema>;
export type ScheduleAction = z.infer<typeof ScheduleActionSchema>;
export type DeleteAction = z.infer<typeof DeleteActionSchema>;
export type ChangeAction = z.infer<typeof ChangeActionSchema>;
