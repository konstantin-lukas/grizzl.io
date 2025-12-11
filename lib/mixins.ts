import { ID_LENGTH } from "../shared/constants/data";
import { boolean, char, timestamp } from "drizzle-orm/pg-core";
import { customAlphabet } from "nanoid";

export function generateId() {
    const nanoid = customAlphabet("23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz", ID_LENGTH);
    return nanoid();
}

export const id = {
    id: char({ length: ID_LENGTH }).primaryKey().$defaultFn(generateId),
};

export const createdAt = {
    createdAt: timestamp().defaultNow().notNull(),
};

export const deleted = {
    deleted: boolean().default(false).notNull(),
};
