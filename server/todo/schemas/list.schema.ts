import { createdAt, deletedAt, icon, id, userId } from "../../../database/mixins";
import { TITLE_MAX } from "../../../shared/core/validators/core.validator";
import { pgTable, varchar } from "drizzle-orm/pg-core";

export const todoList = pgTable("todo_list", {
    ...id,
    ...userId,
    ...createdAt,
    ...deletedAt,
    ...icon,
    title: varchar({ length: TITLE_MAX }).notNull(),
});
