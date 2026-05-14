import { IconTagsMap } from "#shared/core/maps/icon-tags.map";
import { BASE_LIST } from "~~/test-utils/constants/todo";
import { str } from "~~/test-utils/helpers/data";
import { omit } from "~~/test-utils/helpers/object";
import { createInvalidTypeTestCases } from "~~/test-utils/playwright/test-tables/base";

function withList(property: keyof typeof BASE_LIST, value: unknown) {
    return { ...BASE_LIST, items: [], [property]: value };
}

const LIST_INVALID_DATA_CASES = [
    ...createInvalidTypeTestCases(BASE_LIST, "title", { valid: ["string"] }),
    ...createInvalidTypeTestCases(BASE_LIST, "icon", { valid: ["string"] }),
] as never;

const LIST_INVALID_TYPE_CASES = [
    ["the title is empty", withList("title", "")],
    ["the title is empty after trimming", withList("title", " ")],
    ["the title is too long", withList("title", str({ length: 101 }))],
    ["the title is missing", omit(BASE_LIST, "title")],
    ["the icon is invalid", withList("icon", "bananas")],
    ["the icon is missing", omit(BASE_LIST, "icon")],
];

export const LIST_BAD_REQUEST_TEST_CASES = [...LIST_INVALID_DATA_CASES, ...LIST_INVALID_TYPE_CASES];

export const LIST_VALID_REQUEST_TEST_CASES = [
    ["the title is just long enough", withList("title", str({ length: 1 }))],
    ["the title is short long enough", withList("title", str({ length: 100 }))],
    [
        "the title is just short enough after trimming",
        withList("title", ` ${str({ length: 100 })} `),
        withList("title", str({ length: 100 })),
    ],
    ...(IconTagsMap.keys()
        .map(icon => [`the icon is ${icon}`, withList("icon", icon)])
        .toArray() as [string, typeof BASE_LIST][]),
];
