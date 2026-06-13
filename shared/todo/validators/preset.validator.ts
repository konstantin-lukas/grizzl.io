import { LONG_TITLE_MAX, TITLE_MAX, TITLE_MIN, preTrim } from "#shared/core/validators/core.validator";
import { TODO_LIST_MAX_LENGTH } from "#shared/todo/validators/list.validator";
import { z } from "zod";

export const PostPresetSchema = z.object({
    title: preTrim(z.string().min(TITLE_MIN).max(TITLE_MAX)),
    items: z.array(preTrim(z.string().max(LONG_TITLE_MAX))).max(TODO_LIST_MAX_LENGTH),
});

export const PutPresetSchema = PostPresetSchema;

export type PostPreset = z.infer<typeof PostPresetSchema>;
export type PutPreset = z.infer<typeof PutPresetSchema>;
