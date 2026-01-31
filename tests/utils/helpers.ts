import { capitalize } from "~~/tests/utils/string";

interface PRNGOptions {
    seed?: number;
}

interface ArrayOptions {
    length?: number;
    unique?: boolean;
}

type DateOptions = { when?: "past" | "future"; refDate?: string | Date | number } & TimeSpanOptions & PRNGOptions;
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
type StrOptions = { words?: readonly string[]; spaces?: boolean; length?: number } & PRNGOptions;
type StrArrayOptions = { strLength?: number; arrLength?: number } & Omit<StrOptions, "length"> & ArrayOptions;

const DEFAULT_REF_DATE = "2025-06-01T12:00:00Z";
const DEFAULT_SENTENCE_LENGTH = 10;
const DEFAULT_SENTENCE_VARIATION = 5;
const MAX_ATTEMPTS = 100;
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Generates a pseudo random number in a given range. Does not have a running seed and will always return the same value
 * given the same input.
 * @param options Options for generating the number.
 * @param [options.min=0] The smallest possible number to generate (inclusive).
 * @param [options.max=9] The largest possible number to generate (inclusive).
 * @default 9
 * @param [options.seed=0] Randomizes the returned number. Useful if you want multiple numbers in the same range.
 */
export function int(options: IntOptions = {}) {
    const { min = 0, max = 9, seed = 0 } = options;

    if (min > max) {
        throw new RangeError("Option parameter min must be <= max.");
    }

    if (!Number.isInteger(min) || !Number.isInteger(max) || !Number.isInteger(seed)) {
        throw new TypeError("Option parameters min, max, and seed must be integers.");
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

/**
 * @param source A value to duplicate as array elements, an array to randomly select elements from, or a function for
 * generating array elements. If a function is passed, the first argument is a number representing the index of the item
 * when options.unique is false or the current iteration of trying to find a unique value otherwise. This number can
 * be used as a seed.
 * @param options Options to modify how the array is generated.
 * @param [options.length=3] The number of items in the array.
 * @param [options.unique=false] If set to true, ensures that all elements in the array are unique.
 */
export function arr<T extends string | number>(source: T | T[] | ((index: number) => T), options: ArrayOptions = {}) {
    const { length = 3, unique = false } = options;
    const sourceIsCallback = typeof source === "function";

    const unpackValue = (index: number) => {
        const value = sourceIsCallback ? source(index) : source;
        return Array.isArray(value) ? value[int({ min: 0, max: value.length - 1, seed: index })]! : value;
    };

    if (!unique) {
        return Array.from({ length }).map((_, i) => unpackValue(i)) as T[];
    }

    const values = new Set();

    for (let i = 0; values.size < length; i++) {
        if (i > MAX_ATTEMPTS * length) throw new Error("Too many iteration reached trying to generate unique values.");
        values.add(unpackValue(i));
    }

    return [...values] as T[];
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
 * Generates deterministic text. Sentences always begin with a capital letter and always end in a period unless
 * options.spaces is set to false or string length is 1.
 * @param options Options to modify how text is generated.
 * @param [options.length=50] The amount of characters the string should have.
 * @param [options.seed=0] Randomizes the output string.
 * @param [options.spaces=true] Specify if you want to keep spaces or remove them.
 * @param options.words An array of strings to use a word list to generate sentences.
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

    if (words.some(word => word.length === 0 || /\s/.test(word))) {
        throw new Error("Wordlist may not contain empty strings or words containing whitespace.");
    }

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

    const slicedText = text.slice(0, length);

    if (length === 1 || !spaces || slicedText.endsWith(".")) return slicedText;

    const hasPeriodOrSpaceNearTheEnd = /[.\s]+[^.\s]{0,2}$/;
    const matches = slicedText.match(hasPeriodOrSpaceNearTheEnd);

    if (matches) {
        const [match] = matches;
        const vowels = ["a", "i", "e", "o", "u"];
        const endingVowels = arr(vowels, { unique: true, length: match.length - 1 });
        const wordEnding = endingVowels.join("");
        return `${slicedText.slice(0, slicedText.length - match.length)}${wordEnding}.`;
    }

    return `${slicedText.slice(0, length - 1)}.`;
}

/**
 * Creates a fully deterministic date.
 * @param options Options to modify how the date is generated.
 * @param [options.when="past"] In the past or future relative to the reference date.
 * @param [options.days=0] Amount of days between reference date and returned date.
 * @param [options.hours=0] Amount of hours between reference date and returned date.
 * @param [options.minutes=0] Amount of minutes between reference date and returned date.
 * @param [options.seconds=0] Amount of seconds between reference date and returned date.
 * @param [options.refDate="2025-06-01T12:00:00Z"] The date to base date generation on. Defaults to a deterministic
 * value. If you want true future dates pass Date.now(), but be careful as that will create a non-deterministic date.
 * @returns A date relative to the ref date. The default is to return the ref date.
 */
export function date(options: DateOptions = {}) {
    const { when = "past", refDate = DEFAULT_REF_DATE } = options;

    const refTime = new Date(refDate).getTime();
    const timeSpan = getTimeSpan(options);

    const time = when === "past" ? refTime - timeSpan : refTime + timeSpan;

    return new Date(time);
}

/**
 * Refer to the {@link date} and {@link arr} function documentation to understand the options. The time spans you pass
 * define the distance between each generated date.
 */
export function dateArr(options: DateArrayOptions = {}) {
    const { days = 1, hours = 0, minutes = 0, seconds = 0, ...rest } = options;
    const getDate = (index: number) =>
        date({
            ...rest,
            days: days * index,
            hours: hours * index,
            minutes: minutes * index,
            seconds: seconds * index,
        });

    return arr(i => getDate(i).getTime(), options).map(time => new Date(time));
}

/**
 * Refer to the {@link int} and {@link arr} function documentation to understand the options.
 */
export function intArr(options: IntArrayOptions = {}) {
    const { seed = 0 } = options;
    return arr(i => int({ ...options, seed: seed + i }), options);
}

/**
 * Refer to the {@link str} and {@link arr} function documentation to understand the options. For clarity, array length
 * is passed as options.arrLength and string length as options.strLength.
 */
export function strArr(options: StrArrayOptions) {
    const { seed = 0, strLength, arrLength, ...rest } = options;
    return arr(i => str({ ...rest, length: strLength, seed: seed + i }), { ...rest, length: arrLength });
}

/**
 * @returns The provided value or undefined depending on the seed
 */
export function maybe<T>(value: () => T, seed: number) {
    const scrapValue = int({ min: 0, max: 1, seed });
    if (scrapValue) return null;
    return value();
}
