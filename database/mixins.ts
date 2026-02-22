import { generateId } from "../shared/utils/id.util";
import { ID_LENGTH } from "../shared/validators/core.validator";
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
