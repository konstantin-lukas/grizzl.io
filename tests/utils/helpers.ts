import { capitalize } from "~~/tests/utils/string";

type PRNGOptions = { seed?: number };
type DateOptions = { when?: "past" | "future"; refDate?: string | Date | number } & TimeSpanOptions & PRNGOptions;
type ArrayOptions = { length?: number; unique?: boolean };
type IntOptions = { min?: number; max?: number } & PRNGOptions;
type DateArrayOptions = DateOptions & ArrayOptions;
type IntArrayOptions = IntOptions & ArrayOptions;
type TimeSpanOptions = {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    exact?: boolean;
} & PRNGOptions;
type StrOptions = { words?: string[]; spaces?: boolean; length?: number } & PRNGOptions;

const DEFAULT_REF_DATE = "2025-06-01T12:00:00Z";
const DEFAULT_SENTENCE_LENGTH = 10;
const DEFAULT_SENTENCE_VARIATION = 5;
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const TYPES = [
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
        valid?: (typeof TYPES)[number][0][];
        caseName?: (property: string, type: string) => string;
        dataTransform?: (data: T, property: string, value: (typeof TYPES)[number][1]) => unknown;
    },
) {
    const testCases = [];
    for (const [type, value] of TYPES) {
        if (!(options.valid ?? []).includes(type)) {
            testCases.push([
                options.caseName?.(property as string, type) ?? `property ${property as string} is a ${type}`,
                options.dataTransform?.(data, property as string, value) ?? { ...data, [property]: value },
            ]);
        }
    }
    return testCases;
}

/**
 * Generates a pseudo random number in a given range. Does not have a running seed and will always return the same value
 * given the same input.
 * @param options Options for generating the number
 * @param options.min The smallest possible number to generate. Defaults to 1.
 * @param options.max The largest possible number to generate. Defaults to 5.
 * @param options.seed Influences the returned number in the range. Useful if you want multiple numbers in the same range. Defaults to 0.
 */
export function int(options: IntOptions = {}) {
    const { min = 1, max = 5, seed = 0 } = options;

    if (min > max) {
        throw new RangeError("min must be <= max");
    }

    if (!Number.isInteger(min) || !Number.isInteger(max) || !Number.isInteger(seed)) {
        throw new TypeError("min, max, and seed must be integers");
    }

    // Combine inputs into a single 32-bit value
    let x = Math.imul(min, 374761393) ^ Math.imul(max, 668265263) ^ Math.imul(seed, 1442695041);

    // Mix (avalanche)
    x ^= x >>> 13;
    x = Math.imul(x, 1274126177);
    x ^= x >>> 16;

    // Normalize
    const normalized = (x >>> 0) / 2 ** 32;

    // Scale to range
    return Math.floor(normalized * (max - min + 1)) + min;
}

function getTimeSpan(options: TimeSpanOptions) {
    const { exact = true, seed } = options;

    const dayRange = options.days ?? 0;
    const hourRange = options.hours ?? 0;
    const minuteRange = options.minutes ?? 0;
    const secondRange = options.seconds ?? 0;

    const days = (exact ? dayRange : int({ min: 0, max: dayRange, seed })) * DAY;
    const hours = (exact ? hourRange : int({ min: 0, max: hourRange, seed })) * HOUR;
    const minutes = (exact ? minuteRange : int({ min: 0, max: minuteRange, seed })) * MINUTE;
    const seconds = (exact ? secondRange : int({ min: 0, max: secondRange, seed })) * SECOND;

    return days + hours + minutes + seconds;
}

/**
 * Generates a deterministic text. Defaults to a lorem ipsum text that has no trailing whitespace. You usually want to
 * avoid trailing white space for limit testing text lengths that may implicitly be trimmed by your production code.
 * @param options Options to modify how text is generated.
 * @param options.length The amount of characters the string should have. Defaults to 56.
 * @param options.base The base text to repeat or slice to match the desired length. Default to a lorem ipsum text.
 * @param options.spaces Specify if you want to keep spaces, remove them, or only remove trailing spaces.
 * Only applies when you use the default base. Use when you want to generate multiple different strings. Loops at 25.
 */
export function str(options: StrOptions = {}) {
    // prettier-ignore
    const {
        spaces = true,
        length = 50,
        seed = 0,
        words = [
            "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod",
            "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim", "ad", "minim", "veniam",
            "quis", "nostrud", "exercitation", "ullamco", "laboris", "duis", "aute", "irure", "in", "reprehenderit",
            "voluptate", "velit", "esse", "cillum", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident",
            "sunt", "culpa", "qui", "officia", "curabitur", "pretium", "tincidunt", "lacus", "nulla", "gravida", "orci",
            "a", "odio", "nullam", "varius", "turpis", "commodo", "pharetra", "est", "eros", "bibendum", "aliquam",
            "erat", "volutpat", "nam", "dui", "mi", "phasellus", "ultrices", "nibh", "quisque", "lectus", "donec",
            "consectetuer", "ligula", "vulputate", "sem", "tristique", "cursus", "praesent", "dapibus", "neque", "id",
            "faucibus", "tortor", "egestas", "augue", "eu", "vitae", "libero", "ac", "risus", "placerat", "vestibulum",
            "felis", "leo", "cras", "iaculis", "vivamus", "molestie", "fusce", "lobortis", "suspendisse", "potenti",
            "sapien", "consequat", "etiam", "vel", "sodales", "tellus", "mauris", "fermentum", "dictum", "laoreet",
            "quisque", "aenean", "eget", "condimentum", "pellentesque", "nisi", "euismod", "integer", "sollicitudin",
            "interdum"
        ]
    } = options;

    if (length === 0) return "";

    const getNextPeriod = (i: number) =>
        i +
        int({
            min: DEFAULT_SENTENCE_LENGTH - DEFAULT_SENTENCE_VARIATION,
            max: DEFAULT_SENTENCE_LENGTH + DEFAULT_SENTENCE_VARIATION,
            seed: i,
        });
    let nextPeriod = getNextPeriod(seed);
    let lastPeriod = seed - 1;
    let text = "";

    for (let i = seed; text.length < length; i++) {
        const word = words[int({ min: 0, max: words.length - 1, seed: i })]!;
        if (!spaces) {
            text += word;
            continue;
        }
        const capitalizeWord = i - 1 === lastPeriod;
        text += capitalizeWord ? capitalize(word) : word;
        if (i === nextPeriod) {
            text += ". ";
            lastPeriod = i;
            nextPeriod = getNextPeriod(i);
            continue;
        }
        text += " ";
    }

    if (!spaces) return text.slice(0, length);
    if (length === 1) return text[0];

    if (text[text.length - 2] === " ") {
        const vowels = ["a", "i", "e", "o", "u"];
        const vowel = int({ min: 0, max: vowels.length - 1, seed });
        return `${text.slice(0, length - 2)}${vowel}.`;
    }

    return `${text.slice(0, length - 1)}.`;
}

/**
 *
 * @param source A value to duplicate as array elements or a function to generate array elements
 * @param options Options to modify how the array is generated.
 * @param options.length The number of items in the array. Defaults to 3.
 */
export function arr<T extends string | number | object>(
    source: T | ((index: number) => T),
    options: ArrayOptions = {},
) {
    const { length = 3 } = options;
    const array = Array.from({ length });
    if (typeof source === "function") return array.map((_, i) => source(i)) as T[];
    return array.fill(source) as T[];
}

/**
 * Creates a fully deterministic date.
 * @param options Options to modify how the date is generated.
 * @param options.when In the past or future relative to the reference date
 * @param options.days Amount of days between reference date and returned date
 * @param options.hours Amount of hours between reference date and returned date
 * @param options.minutes Amount of minutes between reference date and returned date
 * @param options.seconds Amount of seconds between reference date and returned date
 * @param options.refDate The date to base date generation on. Defaults to a deterministic value. If you want true
 * future dates pass Date.now()
 * @returns A date relative to the ref date. Default return value is 2024-05-01T12:00:00Z.
 */
export function date(options: DateOptions = {}) {
    const { when = "past", refDate = DEFAULT_REF_DATE, days, hours, minutes, seconds, seed } = options;

    const refTime = new Date(refDate).getTime();
    const timeSpan = getTimeSpan({ days, hours, minutes, seconds, seed });
    const time = when === "past" ? refTime - timeSpan : refTime + timeSpan;

    return new Date(time);
}

/**
 * @param options The same options you'd pass to the {@link date} helper function. The years, days, hours, minutes, and seconds
 * define the distance between array items. Also allows setting the array length.
 */
export function dateArr(options: DateArrayOptions = {}) {
    const { days = 1, hours = 0, minutes = 0, seconds = 0, length, ...rest } = options;
    const getDate = (index: number) =>
        date({
            ...rest,
            days: days * index,
            hours: hours * index,
            minutes: minutes * index,
            seconds: seconds * index,
        });

    return arr(getDate, { length });
}

/**
 * @param options The same options you'd pass to the {@link int} helper function. Also allows setting the array length.
 */
export function intArr(options: IntArrayOptions = {}) {
    const { seed = 0 } = options;
    return arr(i => int({ ...options, seed: seed + i }), options);
}
