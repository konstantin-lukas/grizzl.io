import { createdAt, deletedAt, id } from "../../../database/mixins";
import { financeAccount } from "../../../server/finance/schemas/account.schema";
import { ID_LENGTH, TITLE_MAX } from "../../../shared/core/validators/core.validator";
import { Category } from "../../../shared/finance/enums/category.enum";
import { bigint, char, pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";

export const financeCategoryEnum = pgEnum("finance_category", Category);

export const financeTransaction = pgTable("finance_transaction", {
    ...id,
    ...deletedAt,
    ...createdAt,
    accountId: char({ length: ID_LENGTH })
        .references(() => financeAccount.id, { onDelete: "cascade" })
        .notNull(),
    amount: bigint({ mode: "number" }).default(0).notNull(),
    reference: varchar({ length: TITLE_MAX }).notNull(),
    category: financeCategoryEnum().notNull(),
});
