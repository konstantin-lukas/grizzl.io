import { DatabaseIdSchema, TITLE_MAX, TITLE_MIN } from "#shared/core/validators/core.validator";
import { z } from "zod";

export const GetTransactionFiltersSchema = z.object({
    from: z.iso
        .datetime()
        .transform(v => new Date(v))
        .optional(),
    to: z.iso
        .datetime()
        .transform(v => new Date(v))
        .optional(),
    reference: z.string().min(TITLE_MIN).max(TITLE_MAX).optional(),
    categoryId: DatabaseIdSchema.optional(),
});

export const PostTransactionSchema = z.object({
    amount: z.int(),
    reference: z.string().min(TITLE_MIN).max(TITLE_MAX).nullable(),
    categoryId: DatabaseIdSchema,
});

export const PutTransactionSchema = PostTransactionSchema;

export type GetTransactionFilters = z.infer<typeof GetTransactionFiltersSchema>;
export type PostTransaction = z.infer<typeof PostTransactionSchema>;
export type PutTransaction = z.infer<typeof PutTransactionSchema>;
