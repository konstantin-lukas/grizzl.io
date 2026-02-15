import { deepCopy } from "#shared/utils/object.util";
import { expect, test } from "vitest";

test.each([
    {
        name: "simple object",
        input: { a: 1, b: 2 },
        expected: { a: 1, b: 2 },
    },
    {
        name: "nested object",
        input: { a: { b: { c: 3 } } },
        expected: { a: { b: { c: 3 } } },
    },
    {
        name: "array with nested object",
        input: [1, 2, { a: 3 }],
        expected: [1, 2, { a: 3 }],
    },
    {
        name: "object with null field",
        input: { a: null, b: 2 },
        expected: { a: null, b: 2 },
    },
    {
        name: "object with undefined and function",
        input: { a: 1, b: undefined, c: () => 123 },
        expected: { a: 1 },
    },
    {
        name: "Date becomes ISO string",
        input: { date: new Date("2020-01-01T00:00:00Z") },
        expected: { date: "2020-01-01T00:00:00.000Z" },
    },
] as const)("should deep copy: $name", ({ input, expected }) => {
    const result = deepCopy(input);

    expect(result).toEqual(expected);

    if (typeof input === "object" && input !== null) {
        expect(result).not.toBe(input);
    }
});

test("should not mutate the original object", () => {
    const original = { a: { b: 1 } };
    const copy = deepCopy(original);

    copy.a.b = 2;

    expect(original.a.b).toBe(1);
    expect(copy.a.b).toBe(2);
});

test("should throw for circular references", () => {
    const circular = { self: "" };
    circular.self = circular as unknown as string;

    expect(() => deepCopy(circular)).toThrow();
});
