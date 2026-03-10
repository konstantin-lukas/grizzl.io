import { TITLE_MAX, TITLE_MIN } from "#shared/core/validators/core.validator";
import { z } from "zod";

export const ISO_4217_CODE_LENGTH = 3;

export const PostAccountSchema = z.object({
    title: z.string().min(TITLE_MIN).max(TITLE_MAX),
    currency: z.string().refine(value => new RegExp(`^[A-Z]{${ISO_4217_CODE_LENGTH}}$`).test(value)),
});

export type PostAccount = z.infer<typeof PostAccountSchema>;
