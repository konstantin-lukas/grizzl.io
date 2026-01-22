interface TimeSpan {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
}

type DateOptions = { when?: "past" | "future"; refDate?: string | Date | number } & TimeSpan;

const DEFAULT_REF_DATE = "2025-06-01T12:00:00Z";
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

function getTimeSpan(options: TimeSpan) {
    const days = (options.days ?? 0) * DAY;
    const hours = (options.hours ?? 0) * HOUR;
    const minutes = (options.minutes ?? 0) * MINUTE;
    const seconds = (options.seconds ?? 0) * SECOND;

    return days + hours + minutes + seconds;
}

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
 * Generates a deterministic text. Defaults to a lorem ipsum text that has no trailing whitespace. You usually want to
 * avoid trailing white space for limit testing text lengths that may implicitly be trimmed by your production code.
 * @param options Options to modify how text is generated.
 * @param options.length The amount of characters the string should have. Defaults to 56.
 * @param options.base The base text to repeat or slice to match the desired length. Default to a lorem ipsum text.
 * @param options.spaces Specify if you want to keep spaces, remove them, or only remove trailing spaces.
 * @param options.rotate The index of the sentence in the default lorem text to start the string with.
 * Only applies when you use the default base. Use when you want to generate multiple different strings. Loops at 25.
 */
export function str(
    options: { base?: string; spaces?: "yes" | "no" | "noTrailingSpace"; rotate?: number; length?: number } = {},
): string {
    const sentences = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
        "Curabitur pretium tincidunt lacus, nulla gravida orci a odio.",
        "Nullam varius, turpis et commodo pharetra, est eros bibendum elit.",
        "Aliquam erat volutpat, nam dui mi tincidunt quis.",
        "Phasellus ultrices nulla quis nibh, quisque a lectus.",
        "Donec consectetuer ligula vulputate sem tristique cursus.",
        "Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue.",
        "Eu vulputate magna eros eu erat, aliquam erat volutpat.",
        "Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus.",
        "Morbi in sem quis dui placerat ornare.",
        "Pellentesque odio nisi, euismod in, pharetra a, ultricies in.",
        "Integer vitae libero ac risus egestas placerat.",
        "Vestibulum commodo felis quis tortor.",
        "Ut aliquam sollicitudin leo, cras iaculis ultricies nulla.",
        "Donec quis dui at dolor tempor interdum.",
        "Vivamus molestie gravida turpis, fusce lobortis lorem at ipsum.",
        "Suspendisse potenti, sed egestas eros at sapien consequat.",
        "Etiam vel tortor sodales tellus ultricies commodo.",
        "Mauris fermentum dictum magna, sed laoreet aliquam leo.",
        "Quisque sit amet est et sapien ullamcorper pharetra.",
        "Aenean fermentum, elit eget tincidunt condimentum.",
    ];

    const { rotate = 0 } = options;

    const shift = rotate % sentences.length;
    const lorem = sentences.slice(shift).concat(sentences.slice(0, shift)).join(" ");

    const { spaces = "noTrailingSpace", base = lorem, length = 56 } = options;

    const text = (() => {
        if (spaces === "no") return base.replaceAll(/\s/g, "");
        if (spaces === "noTrailingSpace") return base.slice(0, length).trimEnd();
        return base;
    })();

    const repetitions = Math.ceil(length / text.length) || 1;

    return text.repeat(repetitions).slice(0, length);
}

/**
 *
 * @param source A value to duplicate as array elements or a function to generate array elements
 * @param options Options to modify how the array is generated.
 * @param options.length The number of items in the array. Defaults to 3.
 */
export function arr<T extends string | number | object>(
    source: T | ((index: number) => T),
    options: { length?: number } = {},
) {
    const { length = 3 } = options;
    if (typeof source === "function") {
        const array: T[] = [];
        for (let i = 0; i < length; i++) {
            array.push(source(i));
        }
        return array;
    }
    return Array.from({ length }).fill(source) as T[];
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
    const { when = "past", refDate = DEFAULT_REF_DATE, days, hours, minutes, seconds } = options;

    const refTime = new Date(refDate).getTime();
    const timeSpan = getTimeSpan({ days, hours, minutes, seconds });
    const time = when === "past" ? refTime - timeSpan : refTime + timeSpan;

    return new Date(time);
}

/**
 * @param length The amount of dates you want returned.
 * @param options The same options you'd pass to the date helper function. The years, days, hours, minutes, and seconds
 * define the distance between array items.
 */
export function dateArr(length: number, options: DateOptions = {}) {
    const { days = 1, hours = 0, minutes = 0, seconds = 0, ...rest } = options;
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
