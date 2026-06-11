import { BASE_LIST, BASE_PRESET, FULL_LIST, FULL_PRESET } from "~~/test-utils/constants/todo";
import { type Method, TestBuilder } from "~~/test-utils/playwright/builders/base";
import {
    LIST_BAD_REQUEST_TEST_CASES,
    LIST_VALID_REQUEST_TEST_CASES,
    PRESET_BAD_REQUEST_TEST_CASES,
    PRESET_VALID_REQUEST_TEST_CASES,
} from "~~/test-utils/playwright/test-tables/todo";

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

export function makePresetTestBuilder(method: Method) {
    return new TestBuilder({
        fixtureProvider: async options => {
            const { db, userId, count = 1 } = options;
            const [list] = await db.todoList.insert(1, userId ? { userId } : undefined);
            const [preset, ...rest] = await db.todoPreset.insert(count as 1, { listId: list.id });
            return {
                id: preset.id,
                parentId: list.id,
                data: count > 1 ? [preset, ...rest] : preset,
                basePath: `/api/todo/lists/${list.id}/presets`,
                fullPath: `/api/todo/lists/${list.id}/presets/${preset.id}`,
                getDatabaseOverrides: { listId: undefined, createdAt: undefined },
                postDatabaseOverrides: { listId: list.id },
            };
        },
        baseData: BASE_PRESET,
        fullData: FULL_PRESET,
        badPost: PRESET_BAD_REQUEST_TEST_CASES,
        badPut: [],
        validPost: PRESET_VALID_REQUEST_TEST_CASES,
        validPut: [],
        fixtureName: "todoPreset",
        parentFixtureName: "todoList",
        method,
    });
}
