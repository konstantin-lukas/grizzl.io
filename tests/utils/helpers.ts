import { faker } from "@faker-js/faker";

const types = [
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
        caseName?: (property: string, type: string) => string;
        dataTransform?: (data: T, property: string, value: (typeof types)[number][1]) => unknown;
    },
) {
    const testCases = [];
    for (const [type, value] of types) {
        if (!(options.valid ?? []).includes(type)) {
            testCases.push([
                options.caseName?.(property as string, type) ?? `property ${property as string} is a ${type}`,
                options.dataTransform?.(data, property as string, value) ?? { ...data, [property]: value },
            ]);
        }
    }
    return testCases;
}

export function str(len: number) {
    return faker.string.alphanumeric({ length: len });
}

export function arr<T>(len: number, value: T) {
    return Array.from({ length: len }).fill(value) as T[];
}
