import { createdAt, deletedAt, id, userId } from "../../../database/mixins";
import { financeAccount } from "../../../server/finance/schemas/account.schema";
import { financeCategoryEnum } from "../../../server/finance/schemas/transaction.schema";
import { ID_LENGTH, TITLE_MAX } from "../../../shared/core/validators/core.validator";
import { bigint, char, date, integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const financeAutoTransaction = pgTable("finance_auto_transaction", {
    ...id,
    ...userId,
    ...deletedAt,
    ...createdAt,
    accountId: char({ length: ID_LENGTH })
        .references(() => financeAccount.id, { onDelete: "cascade" })
        .notNull(),
    amount: bigint({ mode: "number" }).notNull(),
    reference: varchar({ length: TITLE_MAX }),
    category: financeCategoryEnum().notNull(),
    execInterval: integer().notNull(), // 1-12
    execOn: integer().notNull(), // 1-31
    lastExec: date().notNull(),
});
