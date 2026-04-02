import { user } from "../server/core/schemas/auth.schema";
import { nanoid } from "../shared/core/utils/id.util";
import { ID_LENGTH } from "../shared/core/validators/core.validator";
import { char, timestamp } from "drizzle-orm/pg-core";

export const id = {
    id: char({ length: ID_LENGTH }).primaryKey().$defaultFn(nanoid),
};

export const createdAt = {
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
};

export const deletedAt = {
    deletedAt: timestamp({ withTimezone: true }),
};

export const userId = {
    userId: char({ length: ID_LENGTH })
        .references(() => user.id, { onDelete: "cascade" })
        .notNull(),
};
