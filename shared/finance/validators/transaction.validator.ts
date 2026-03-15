import { TITLE_MAX, TITLE_MIN } from "#shared/core/validators/core.validator";
import { z } from "zod";
import { Category } from "~~/shared/finance/enums/category.enum";

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
    category: z.enum(Category).optional(),
});

export type GetTransactionFilters = z.infer<typeof GetTransactionFiltersSchema>;
