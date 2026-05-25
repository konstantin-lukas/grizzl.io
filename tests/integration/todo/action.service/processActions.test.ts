import EntityLimitError from "#server/core/errors/entity-limit.error";
import NotFoundError from "#server/core/errors/not-found.error";
import UniqueConstraintError from "#server/core/errors/unique-constraint.error";
import ActionService from "#server/todo/services/action.service";
import ListItemRepository from "~~/server/todo/repositories/list-item.repository";
import ListRepository from "~~/server/todo/repositories/list.repository";
import { omit } from "~~/test-utils/helpers/object";
import { expect, test } from "~~/test-utils/vitest";

let actionService: ActionService;

test.beforeEach(({ db }) => {
    const listRepository = new ListRepository(db.client);
    const listItemRepository = new ListItemRepository(db.client);
    actionService = new ActionService(listRepository, listItemRepository);
});

test("throws a NotFoundError and rolls back all actions when trying to operate on an account not belonging to the current user", async ({
    db,
    user,
}) => {
    const [list] = await db.todoList.insert(1, { userId: user.id });
    await expect(
        actionService.processActions(user.id, [
            { action: "create", id: "2222222222222222", index: 0, listId: list.id, text: "" },
            { action: "create", id: "2222222222222222", index: 0, listId: "2222222222222222", text: "" },
        ]),
    ).rejects.toThrow(NotFoundError);
    const listItemsAfterActions = await db.todoListItem.select();
    expect(listItemsAfterActions).toStrictEqual([]);
});

test("allows creating a single todo item but doesn't allow setting scheduledFor", async ({ db, user }) => {
    const [list] = await db.todoList.insert(1, { userId: user.id });
    const item = {
        action: "create",
        id: "2222222222222222",
        index: 0,
        listId: list.id,
        text: "Bananas",
        scheduledFor: "2025-01-15",
    } as const;
    await actionService.processActions(user.id, [item]);
    const listItemsAfterActions = await db.todoListItem.select();
    expect(listItemsAfterActions).toStrictEqual([{ ...omit(item, "action"), scheduledFor: null }]);
});

test("allows executing multiple actions with a single function call", async ({ db, user }) => {
    const [list] = await db.todoList.insert(1, { userId: user.id });
    const item1 = { action: "create", id: "2222222222222222", index: 0, listId: list.id, text: "Bananas" } as const;
    const item2 = { action: "create", id: "2222222222222223", index: 1, listId: list.id, text: "Bananas" } as const;
    await actionService.processActions(user.id, [item1, item2]);
    const listItemsAfterActions = await db.todoListItem.select();
    expect(listItemsAfterActions).toStrictEqual([
        { ...omit(item1, "action"), scheduledFor: null },
        { ...omit(item2, "action"), scheduledFor: null },
    ]);
});

test("moves all items after the given index back one position", async ({ db, user }) => {
    const [list] = await db.todoList.insert(1, { userId: user.id });
    const items = await db.todoListItem.insert(5, { listId: list.id });
    const item = { action: "create", id: "2222222222222222", index: 2, listId: list.id, text: "Bananas" } as const;
    await actionService.processActions(user.id, [item]);
    const listItemsAfterActions = await db.todoListItem.select();
    expect(listItemsAfterActions).toStrictEqual(
        expect.arrayContaining([
            items[0],
            items[1],
            { ...omit(item, "action"), scheduledFor: null },
            { ...items[2], index: 3 },
            { ...items[3], index: 4 },
            { ...items[4], index: 5 },
        ]),
    );
});

test("does not move any items back one position if the given index is null", async ({ db, user }) => {
    const [list] = await db.todoList.insert(1, { userId: user.id });
    const items = await db.todoListItem.insert(5, { listId: list.id });
    const item = { action: "create", id: "2222222222222222", index: null, listId: list.id, text: "Bananas" } as const;
    await actionService.processActions(user.id, [item]);
    const listItemsAfterActions = await db.todoListItem.select();
    expect(listItemsAfterActions).toStrictEqual(
        expect.arrayContaining([...items, { ...omit(item, "action"), scheduledFor: null }]),
    );
});

test("throws a UniqueConstraintError and rolls back all actions when trying to insert multiple items with the same id on the same list", async ({
    db,
    user,
}) => {
    const [list] = await db.todoList.insert(1, { userId: user.id });
    const item = { action: "create", id: "2222222222222222", index: 0, listId: list.id, text: "" } as const;
    await expect(actionService.processActions(user.id, [item, item])).rejects.toThrow(UniqueConstraintError);
    const listItemsAfterActions = await db.todoListItem.select();
    expect(listItemsAfterActions).toStrictEqual([]);
});

test("does not throw when creating multiple elements with the same id on different lists", async ({ db, user }) => {
    const [list1, list2] = await db.todoList.insert(2, { userId: user.id });
    const item1 = { action: "create", id: "2222222222222222", index: 0, listId: list1.id, text: "" } as const;
    const item2 = { action: "create", id: "2222222222222222", index: 0, listId: list2.id, text: "" } as const;
    await expect(actionService.processActions(user.id, [item1, item2])).resolves.not.toThrow();
    const listItemsAfterActions = await db.todoListItem.select();
    expect(listItemsAfterActions).toHaveLength(2);
});

test("throws a UniqueConstraintError when trying to create multiple elements with the same text and index null", async ({
    db,
    user,
}) => {
    const [list] = await db.todoList.insert(1, { userId: user.id });
    const item1 = { action: "create", id: "2222222222222222", index: null, listId: list.id, text: "a" } as const;
    const item2 = { action: "create", id: "2222222222222223", index: null, listId: list.id, text: "a" } as const;
    await expect(actionService.processActions(user.id, [item1, item2])).rejects.toThrow(UniqueConstraintError);
});

test("does not throw when trying to create multiple elements with the same text and index null on different lists", async ({
    db,
    user,
}) => {
    const [list1, list2] = await db.todoList.insert(2, { userId: user.id });
    const item1 = { action: "create", id: "2222222222222222", index: null, listId: list1.id, text: "a" } as const;
    const item2 = { action: "create", id: "2222222222222222", index: null, listId: list2.id, text: "a" } as const;
    await expect(actionService.processActions(user.id, [item1, item2])).resolves.not.toThrow();
});

test("does not throw when creating multiple elements with index null", async ({ db, user }) => {
    const [list1, list2] = await db.todoList.insert(2, { userId: user.id });
    const item1 = { action: "create", id: "2222222222222222", index: null, listId: list1.id, text: "a" } as const;
    const item2 = { action: "create", id: "2222222222222223", index: null, listId: list2.id, text: "b" } as const;
    await expect(actionService.processActions(user.id, [item1, item2])).resolves.not.toThrow();
});

test("throws an EntityLimitError error when trying to create tasks on a full list", async ({ db, user }) => {
    const [list] = await db.todoList.insert(1, { userId: user.id });
    await db.todoListItem.insert<number>(1000, { listId: list.id });
    const item = { action: "create", id: "2222222222222222", index: null, listId: list.id, text: "" } as const;
    await expect(actionService.processActions(user.id, [item])).rejects.toThrow(EntityLimitError);
});
