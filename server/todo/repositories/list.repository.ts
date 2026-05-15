import { todoListItem } from "#server/todo/schemas/list-item.schema";
import type { PostList, PutList } from "#shared/todo/validators/list.validator";
import { and, desc, eq, isNull, sql } from "drizzle-orm";
import type { drizzle } from "drizzle-orm/node-postgres";
import BaseRepository from "~~/server/core/repositories/base.repository";

const schema = "todoList";

export default class ListRepository extends BaseRepository<typeof schema> {
    constructor(db: ReturnType<typeof drizzle>) {
        super(db, schema, userId => eq(this.schema.userId, userId));
    }

    public async findByUserId(userId: string) {
        const data = await this.db
            .select({
                id: this.schema.id,
                title: this.schema.title,
                icon: this.schema.icon,
                createdAt: this.schema.createdAt,
                items: sql`
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', ${todoListItem.id},
                            'text', ${todoListItem.text},
                            'scheduledFor', ${todoListItem.scheduledFor}
                        )
                        ORDER BY ${todoListItem.index}
                    ) FILTER (WHERE ${todoListItem.id} IS NOT NULL),
                    '[]'
                )
            `.as("items"),
            })
            .from(this.schema)
            .leftJoin(todoListItem, eq(this.schema.id, todoListItem.listId))
            .where(and(eq(this.schema.userId, userId), isNull(this.schema.deletedAt)))
            .groupBy(this.schema.id)
            .orderBy(desc(this.schema.createdAt));

        return data as typeof data & { items: { id: string; text: string; scheduledFor: Date | null }[] };
    }

    async create(userId: string, { icon, title }: PostList) {
        const [{ listId }] = (await this.db
            .insert(this.schema)
            .values({ userId, icon, title })
            .returning({ listId: this.schema.id })) as [{ listId: string }];

        return listId;
    }

    public async update(id: string, userId: string, { title, icon }: PutList) {
        const { rowCount } = await this.db
            .update(this.schema)
            .set({ title, icon })
            .where(and(eq(this.schema.id, id), eq(this.schema.userId, userId)));

        return rowCount;
    }
}
