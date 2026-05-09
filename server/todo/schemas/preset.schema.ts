import { createdAt, id } from "../../../database/mixins";
import { ID_LENGTH, LONG_TITLE_MAX, TITLE_MAX } from "../../../shared/core/validators/core.validator";
import { todoList } from "./list.schema";
import { sql } from "drizzle-orm";
import { char, pgTable, varchar } from "drizzle-orm/pg-core";

export const todoPreset = pgTable("todo_preset", {
    ...id,
    ...createdAt,
    title: varchar({ length: TITLE_MAX }).notNull(),
    listId: char({ length: ID_LENGTH })
        .references(() => todoList.id, { onDelete: "cascade" })
        .notNull(),
    items: varchar({ length: LONG_TITLE_MAX })
        .array()
        .notNull()
        .default(sql`ARRAY[]::varchar[]`),
});
