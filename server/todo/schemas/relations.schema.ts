import { todoListItem } from "./list-item.schema";
import { todoList } from "./list.schema";
import { relations } from "drizzle-orm";

export const listRelations = relations(todoList, ({ many }) => ({
    items: many(todoListItem),
}));

export const listItemRelations = relations(todoListItem, ({ one }) => ({
    list: one(todoList, {
        fields: [todoListItem.listId],
        references: [todoList.id],
    }),
}));
