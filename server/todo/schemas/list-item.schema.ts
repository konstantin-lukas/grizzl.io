import { id } from "../../../database/mixins";
import { ID_LENGTH, LONG_TITLE_MAX } from "../../../shared/core/validators/core.validator";
import { todoList } from "./list.schema";
import { char, date, integer, pgTable, unique, varchar } from "drizzle-orm/pg-core";

export const todoListItem = pgTable(
    "todo_list_item",
    {
        ...id,
        text: varchar({ length: LONG_TITLE_MAX }).notNull(),
        listId: char({ length: ID_LENGTH })
            .references(() => todoList.id, { onDelete: "cascade" })
            .notNull(),
        index: integer(),
        scheduledFor: date(),
    },
    t => [unique().on(t.listId, t.index)],
);
