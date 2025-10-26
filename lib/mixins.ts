import { char } from "drizzle-orm/pg-core";
import { customAlphabet } from "nanoid";

export function generateId() {
    const nanoid = customAlphabet("23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz", 16);
    return nanoid();
}

export const id = {
    id: char({ length: 16 }).primaryKey().$defaultFn(generateId),
};
