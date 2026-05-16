import { BASE_LIST, FULL_LIST } from "~~/test-utils/constants/todo";
import { type Method, TestBuilder } from "~~/test-utils/playwright/builders/base";
import { LIST_BAD_REQUEST_TEST_CASES, LIST_VALID_REQUEST_TEST_CASES } from "~~/test-utils/playwright/test-tables/todo";

export function makeTodoListTestBuilder(method: Method) {
    return new TestBuilder({
        fixtureProvider: async ({ db, userId }) => {
            const [list] = await db.todoList.insert(1, userId ? { userId } : undefined);
            const items = await db.todoListItem.insert(2, { listId: list.id });
            return {
                id: list.id,
                data: list,
                basePath: "/api/todo/lists",
                fullPath: `/api/todo/lists/${list.id}`,
                putDatabaseOverrides: {
                    items: items.map(({ index, listId, ...rest }) => rest),
                },
                getDatabaseOverrides: {
                    items: { uncompleted: items.map(({ index, listId, ...rest }) => rest), completed: [] },
                },
            };
        },
        baseData: BASE_LIST,
        fullData: FULL_LIST,
        badPost: LIST_BAD_REQUEST_TEST_CASES,
        badPut: LIST_BAD_REQUEST_TEST_CASES,
        validPost: LIST_VALID_REQUEST_TEST_CASES,
        validPut: LIST_VALID_REQUEST_TEST_CASES,
        fixtureName: "todoList",
        dataObjects: [
            {
                fixtureName: "todoListItem",
                foreignKeyName: "listId",
                objectName: "items",
                omittedFields: ["index", "listId"],
            },
        ],
        method,
    });
}
