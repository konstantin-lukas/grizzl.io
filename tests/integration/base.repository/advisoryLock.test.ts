import * as schema from "~~/database/schema";
import BaseRepository from "~~/server/core/repositories/base.repository";
import { expect, test } from "~~/test-utils/vitest";

test("allows creating an application level lock", async ({ db, user }) => {
    const repository = new BaseRepository(db.client, "timer", null as never);
    const [list] = await db.todoList.insert(1, { userId: user.id });
    await db.todoListItem.insert(1, { listId: list.id, index: 0 });
    await Promise.all(
        Array.from({ length: 10 }).map(() =>
            db.client.transaction(async tx => {
                await repository.advisoryLock("bananas", tx);
                const [item] = await tx.select().from(schema["todoListItem"]);
                await tx.update(schema["todoListItem"]).set({ index: (item?.index ?? 0) + 1 });
            }),
        ),
    );
    const [item] = await db.todoListItem.select();
    expect(item?.index).toBe(20);
});
