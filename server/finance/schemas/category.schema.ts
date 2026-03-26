import { id } from "../../../database/mixins";
import { ID_LENGTH, TITLE_MAX } from "../../../shared/core/validators/core.validator";
import { financeAccount } from "./account.schema";
import { char, pgTable, varchar } from "drizzle-orm/pg-core";

export const financeCategory = pgTable("finance_category", {
    ...id,
    accountId: char({ length: ID_LENGTH })
        .references(() => financeAccount.id, { onDelete: "cascade" })
        .notNull(),
    displayName: varchar({ length: TITLE_MAX }).notNull(),
    normalizedName: varchar({ length: TITLE_MAX }).unique().notNull(),
    icon: varchar({ length: TITLE_MAX }).notNull(),
});
