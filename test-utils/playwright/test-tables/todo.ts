/*
function withListItem(property: keyof typeof BASE_LIST_ITEM, value: unknown) {
    return { ...BASE_LIST, intervals: [{ ...BASE_LIST_ITEM, [property]: value }] };
}

function withList(property: keyof typeof BASE_LIST, value: unknown) {
    return { ...BASE_LIST, [property]: value };
}

function createInvalidTypeIntervalTestCases(
    property: keyof (typeof BASE_LIST)["items"][number],
    valid: Parameters<typeof createInvalidTypeTestCases>[2]["valid"],
) {
    return createInvalidTypeTestCases(BASE_LIST_ITEM, property, {
        valid,
        caseName: (property, type) => `property ${property} on a list item is a ${type}`,
        dataTransform: (interval, property, value) => ({
            ...BASE_LIST,
            intervals: [{ ...interval, [property]: value }],
        }),
    });
}*/

const BAD_TOP_LEVEL_CASES = [] as never;

const BAD_LIST_ITEM_LEVEL_CASES = [] as never;

const LIST_INVALID_TYPE_CASES = [] as never;

export const LIST_BAD_REQUEST_TEST_CASES = [
    ...BAD_TOP_LEVEL_CASES,
    ...BAD_LIST_ITEM_LEVEL_CASES,
    ...LIST_INVALID_TYPE_CASES,
];

export const VALID_LIST_LEVEL_CASES = [];

export const VALID_LIST_ITEM_LEVEL_CASES = [];

export const LIST_VALID_REQUEST_TEST_CASES = [...VALID_LIST_LEVEL_CASES, ...VALID_LIST_ITEM_LEVEL_CASES];
