import { ID_LENGTH, LONG_TITLE_MAX } from "../../../shared/core/validators/core.validator";
import { todoList } from "./list.schema";
import { sql } from "drizzle-orm";
import { char, date, integer, pgTable, primaryKey, unique, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const todoListItem = pgTable(
    "todo_list_item",
    {
        id: char({ length: ID_LENGTH }).notNull(),
        text: varchar({ length: LONG_TITLE_MAX }).notNull(),
        listId: char({ length: ID_LENGTH })
            .references(() => todoList.id, { onDelete: "cascade" })
            .notNull(),
        index: integer(),
        scheduledFor: date(),
    },
    t => [
        unique().on(t.listId, t.index),
        uniqueIndex()
            .on(t.listId, t.text)
            .where(sql`${t.index} IS NULL`),
        primaryKey({
            columns: [t.listId, t.id],
        }),
    ],
);
