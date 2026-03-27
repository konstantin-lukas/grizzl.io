import { createdAt, deletedAt, id } from "../../../database/mixins";
import { financeAccount } from "../../../server/finance/schemas/account.schema";
import { ID_LENGTH, TITLE_MAX } from "../../../shared/core/validators/core.validator";
import { financeCategory } from "./category.schema";
import { bigint, char, pgTable, varchar } from "drizzle-orm/pg-core";

export const financeTransaction = pgTable("finance_transaction", {
    ...id,
    ...deletedAt,
    ...createdAt,
    accountId: char({ length: ID_LENGTH })
        .references(() => financeAccount.id, { onDelete: "cascade" })
        .notNull(),
    amount: bigint({ mode: "number" }).notNull(),
    reference: varchar({ length: TITLE_MAX }),
    categoryId: char({ length: ID_LENGTH })
        .references(() => financeCategory.id)
        .notNull(),
});
