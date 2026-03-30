const Types = [
    ["string", "42"],
    ["int", 42],
    ["float", 42.5],
    ["boolean", true],
    ["null", null],
    ["object", {}],
    ["array", []],
] as const;

export function createInvalidTypeTestCases<T extends Record<string, unknown>, K extends keyof T>(
    data: T,
    property: K,
    options: {
        valid?: (typeof Types)[number][0][];
        caseName?: (property: K, type: string) => string;
        dataTransform?: (data: T, property: K, value: (typeof Types)[number][1]) => unknown;
    },
) {
    const testCases = [];
    for (const [type, value] of Types) {
        if (!(options.valid ?? []).includes(type)) {
            testCases.push([
                options.caseName?.(property, type) ?? `property ${property.toString()} is of type ${type}`,
                options.dataTransform?.(data, property, value) ?? { ...data, [property]: value },
            ]);
        }
    }
    return testCases as [string, T][];
}
