import { ID_LENGTH } from "../../shared/features/core/validators/core.validator";
import { generateId } from "../../shared/utils/id.util";
import { char, timestamp } from "drizzle-orm/pg-core";

export const id = {
    id: char({ length: ID_LENGTH }).primaryKey().$defaultFn(generateId),
};

export const createdAt = {
    createdAt: timestamp().defaultNow().notNull(),
};

export const deletedAt = {
    deletedAt: timestamp(),
};
