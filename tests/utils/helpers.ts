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

export function str(len: number, options: { base?: string } = {}): string {
    const { base = "a" } = options;
    return base.repeat(len);
}

export function arr<T extends number | string>(source: T | (() => T), length: number) {
    if (typeof source === "function") {
        const set = new Set<T>();
        const maxAttempts = 1000 * length;
        let attempts = 0;
        while (set.size < length && attempts < maxAttempts) {
            set.add(source());
            attempts++;
        }
        return [...set];
    }
    return Array.from({ length }).fill(source) as T[];
}

export function date(options: { when?: "past" | "future"; years?: number; refDate?: string | Date | number } = {}) {
    const { when = "past", years = 1, refDate = Date.now() } = options;
    const refTime = new Date(refDate).getTime();
    if (when === "past") {
        const past = refTime - years * 365 * 24 * 60 * 60 * 1000;
        return new Date(past + Math.random() * (refTime - past) - 1000);
    }
    if (when === "future") {
        const future = refTime + years * 365 * 24 * 60 * 60 * 1000;
        return new Date(future - Math.random() * (refTime - future) + 1000);
    }
    throw new Error(`Invalid 'when' option: ${when}`);
}

export function dateArr(count: number, ...params: Parameters<typeof date>) {
    return arr(() => date(...params).getTime(), count).map(time => new Date(time));
}
