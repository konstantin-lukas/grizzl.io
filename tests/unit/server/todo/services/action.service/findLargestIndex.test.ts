import ActionService from "#server/todo/services/action.service";
import { expect, test } from "vitest";

test.each([
    {
        title: "returns null when the list has no items",
        list: { items: [] },
        expected: null,
    },
    {
        title: "returns null when the list has one item with index null",
        list: { items: [{ index: null }] },
        expected: null,
    },
    {
        title: "returns null when the list has multiple items with index null",
        list: { items: [{ index: null }, { index: null }] },
        expected: null,
    },
    {
        title: "returns the largest index",
        list: { items: [{ index: 0 }, { index: 1 }, { index: 2 }] },
        expected: 2,
    },
    {
        title: "returns the largest index when there is a null index",
        list: { items: [{ index: 0 }, { index: 1 }, { index: null }] },
        expected: 1,
    },
    {
        title: "returns 0 when there is no other non-null index",
        list: { items: [{ index: 0 }, { index: null }] },
        expected: 0,
    },
    {
        title: "returns 0 when the list has one item with index 0",
        list: { items: [{ index: 0 }] },
        expected: 0,
    },
])("$title", ({ list, expected }) => {
    const result = ActionService.findLargestIndex(list as never);
    expect(result).toBe(expected);
});
