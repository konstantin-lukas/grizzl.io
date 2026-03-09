import { createdAt, deletedAt, id, userId } from "../../../database/mixins";
import { financeAccount } from "../../../server/finance/schemas/account.schema";
import { ID_LENGTH, TITLE_MAX } from "../../../shared/core/validators/core.validator";
import { Category } from "../../../shared/finance/enums/category.enum";
import { bigint, char, pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";

export const financeCategoryEnum = pgEnum("finance_category", Category);

export const financeTransaction = pgTable("finance_transaction", {
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
});
