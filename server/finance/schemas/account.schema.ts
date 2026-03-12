import { createdAt, deletedAt, id, userId } from "../../../database/mixins";
import { TITLE_MAX } from "../../../shared/core/validators/core.validator";
import { ISO_4217_CODE_LENGTH } from "../../../shared/finance/validators/account.validator";
import { bigint, char, pgTable, varchar } from "drizzle-orm/pg-core";

export const financeAccount = pgTable("finance_account", {
    ...id,
    ...userId,
    ...createdAt,
    ...deletedAt,
    title: varchar({ length: TITLE_MAX }).notNull(),
    currency: char({ length: ISO_4217_CODE_LENGTH }).notNull(),
    balance: bigint({ mode: "number" }).default(0).notNull(),
});
