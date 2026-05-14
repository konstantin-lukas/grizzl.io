import ListRepository from "~~/server/todo/repositories/list.repository";
import { expect, test } from "~~/test-utils/vitest";
import { anyId } from "~~/test-utils/vitest/patterns";

test("returns only the todo lists belonging to the requested user", async ({ db, user }) => {
    const [otherUser] = await db.user.insert(1, { name: "Smithers", email: "smithers@burns.com" });
    const otherUsersLists = await db.todoList.insert(5, { userId: otherUser.id });
    for (const list of otherUsersLists) {
        await db.todoListItem.insert(2, { listId: list.id });
    }

    const listRepository = new ListRepository(db.client);
    await db.todoList.insert(2, { userId: user.id });
    const lists = await listRepository.findByUserId(user.id);
    expect(lists).toStrictEqual([
        {
            createdAt: new Date("2025-05-18T01:18:19.000Z"),
            icon: "compare-arrows-rounded",
            id: anyId,
            items: [],
            title: "lobortispellentesquetortorvolutpataliquamlectusvivamusvoluptatequisquesollicitudinnisiaeneanfaucibus",
        },
        {
            createdAt: new Date("2025-01-23T02:17:18.000Z"),
            icon: "child-friendly-outline-rounded",
            id: anyId,
            items: [],
            title: "vitaelobortispellentesquetortorvolutpataliquamlectusvivamusvoluptatequisquesollicitudinnisiaeneanfau",
        },
    ]);
});

test("automatically includes the items belonging to a todo list", async ({ db, user }) => {
    const listRepository = new ListRepository(db.client);
    const [list] = await db.todoList.insert(1, { userId: user.id });
    await db.todoListItem.insert(2, { listId: list.id });
    const [foundList] = await listRepository.findByUserId(user.id);
    expect(foundList).toStrictEqual({
        createdAt: new Date("2025-01-23T02:17:18.000Z"),
        icon: "child-friendly-outline-rounded",
        id: anyId,
        items: [
            {
                id: anyId,
                scheduledFor: null,
                text: "vitaelobortispellentesquetortorvolutpataliquamlectusvivamusvoluptatequisquesollicitudinnisiaeneanfaucibusegetintegeraliquamconsecteturbibendumsodalesturpisirurepretiumphasellusegestaspraesentaliquaexc",
            },
            {
                id: anyId,
                scheduledFor: null,
                text: "lobortispellentesquetortorvolutpataliquamlectusvivamusvoluptatequisquesollicitudinnisiaeneanfaucibusegetintegeraliquamconsecteturbibendumsodalesturpisirurepretiumphasellusegestaspraesentaliquaexcepteu",
            },
        ],
        title: "vitaelobortispellentesquetortorvolutpataliquamlectusvivamusvoluptatequisquesollicitudinnisiaeneanfau",
    });
});

test("returns an empty array when the user id doesn't exist", async ({ db }) => {
    const listRepository = new ListRepository(db.client);
    const lists = await listRepository.findByUserId("bananas");
    expect(lists).toHaveLength(0);
});

test("returns an empty array when no timers exist for the given user id", async ({ db, user }) => {
    const listRepository = new ListRepository(db.client);
    const lists = await listRepository.findByUserId(user.id);
    expect(lists).toHaveLength(0);
});
