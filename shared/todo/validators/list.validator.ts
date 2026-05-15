import { CATEGORY_ICONS } from "#shared/core/constants/category-icons.constant";
import { TITLE_MAX, TITLE_MIN, preTrim } from "#shared/core/validators/core.validator";
import { z } from "zod";

export const TODO_LIST_MAX_LENGTH = 1000;

export const PostListSchema = z.object({
    title: preTrim(z.string().min(TITLE_MIN).max(TITLE_MAX)),
    icon: z.enum(CATEGORY_ICONS),
});

export const PutListSchema = PostListSchema;

export type PostList = z.infer<typeof PostListSchema>;
export type PutList = z.infer<typeof PutListSchema>;
