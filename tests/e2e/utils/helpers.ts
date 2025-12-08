export const types = [
    ["string", "42"],
    ["int", 42],
    ["float", 42.5],
    ["boolean", true],
    ["null", null],
    ["object", {}],
    ["array", []],
] as const;

export function createInvalidTypeTestCases<T extends Record<string, unknown>>(
    data: T,
    property: keyof T,
    options: {
        valid?: (typeof types)[number][0][];
    },
) {
    const testCases = [];
    for (const [type, value] of types) {
        if (!(options.valid ?? []).includes(type)) {
            testCases.push([`property ${property as string} is a ${type}`, { ...data, [property]: value }]);
        }
    }
    return testCases;
}
