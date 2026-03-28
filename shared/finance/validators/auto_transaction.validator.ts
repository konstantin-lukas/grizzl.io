import { PostTransactionSchema } from "#shared/finance/validators/transaction.validator";
import { z } from "zod";

export const FINANCE_EXEC_INTERVAL_MIN = 1;
export const FINANCE_EXEC_INTERVAL_MAX = 12;

export const FINANCE_EXEC_ON_MIN = 1;
export const FINANCE_EXEC_ON_MAX = 31;

export const PostAutoTransactionSchema = PostTransactionSchema.extend({
    execInterval: z.int().min(FINANCE_EXEC_INTERVAL_MIN).max(FINANCE_EXEC_INTERVAL_MAX),
    execOn: z.int().min(FINANCE_EXEC_ON_MIN).max(FINANCE_EXEC_ON_MAX),
    lastExec: z.iso.date(),
});

export const PutAutoTransactionSchema = PostAutoTransactionSchema;

export type PostAutoTransaction = z.infer<typeof PostAutoTransactionSchema>;
export type PutAutoTransaction = z.infer<typeof PutAutoTransactionSchema>;

export type PostAutoTransactionInternal = Omit<PostAutoTransaction, "category"> & { categoryId: string };
export type PutAutoTransactionInternal = Omit<PutAutoTransaction, "category"> & { categoryId: string };
