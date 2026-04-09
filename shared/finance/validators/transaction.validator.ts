import { DatabaseIdSchema, TITLE_MAX, TITLE_MIN } from "#shared/core/validators/core.validator";
import { CategorySchema } from "#shared/finance/validators/category.validator";
import { z } from "zod";

const referenceSchema = z.string().min(TITLE_MIN).max(TITLE_MAX).optional();
const databaseSchema = DatabaseIdSchema.optional();
const isoDateTimeSchema = z.iso.datetime().transform(v => new Date(v));

export const BaseTransactionFiltersSchema = z.object({
    to: isoDateTimeSchema,
    reference: referenceSchema,
    categoryId: databaseSchema,
});

export const GetTransactionFiltersSchema = z.object({
    from: isoDateTimeSchema.optional(),
    to: isoDateTimeSchema.optional(),
    reference: referenceSchema,
    categoryId: databaseSchema,
});

export const PostTransactionSchema = z.object({
    amount: z.int(),
    reference: z
        .string()
        .min(TITLE_MIN)
        .max(TITLE_MAX)
        .nullable()
        .transform(value => (value === "" ? null : value)),
    category: CategorySchema,
});

export const PutTransactionSchema = PostTransactionSchema;

export type GetTransactionFilters = z.infer<typeof GetTransactionFiltersSchema>;
export type BaseTransactionFilters = z.infer<typeof BaseTransactionFiltersSchema>;
export type PostTransaction = z.infer<typeof PostTransactionSchema>;
export type PutTransaction = z.infer<typeof PutTransactionSchema>;
export type Transaction = z.input<typeof PostTransactionSchema> & { id?: string };

export type PostTransactionInternal = Omit<PostTransaction, "category"> & { categoryId: string };
export type PutTransactionInternal = Omit<PutTransaction, "category"> & { categoryId: string };
