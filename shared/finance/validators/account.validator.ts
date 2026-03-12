import { TITLE_MAX, TITLE_MIN } from "../../core/validators/core.validator";
import { z } from "zod";

export const ISO_4217_CODE_LENGTH = 3;

const titleSchema = z.string().min(TITLE_MIN).max(TITLE_MAX);

export const PostAccountSchema = z.object({
    title: titleSchema,
    currency: z.string().refine(value => new RegExp(`^[A-Z]{${ISO_4217_CODE_LENGTH}}$`).test(value)),
});

export const PutAccountSchema = z.object({
    title: titleSchema,
});

export type PostAccount = z.infer<typeof PostAccountSchema>;
export type PutAccount = z.infer<typeof PutAccountSchema>;
