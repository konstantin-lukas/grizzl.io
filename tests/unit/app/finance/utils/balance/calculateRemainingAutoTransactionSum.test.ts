import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { calculateRemainingAutoTransactionSum } from "~/finance/utils/balance";

beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-15T12:00:00.000Z"));
});

afterEach(() => {
    vi.useRealTimers();
});

test("returns 0 when no auto transactions are provided", () => {
    expect(calculateRemainingAutoTransactionSum([])).toBe(0);
});

test("sums only upcoming auto transactions whose next execution is in the current month", () => {
    const result = calculateRemainingAutoTransactionSum([
        {
            execOn: 20,
            lastExec: "2025-05-20",
            execInterval: 1,
            amount: 1000,
        },
        {
            execOn: 16,
            lastExec: "2025-04-16",
            execInterval: 2,
            amount: -250,
        },
    ]);

    expect(result).toBe(750);
});

test("excludes transactions scheduled for today or in the past", () => {
    const result = calculateRemainingAutoTransactionSum([
        {
            execOn: 15,
            lastExec: "2025-05-15",
            execInterval: 1,
            amount: 1000,
        },
        {
            execOn: 14,
            lastExec: "2025-05-14",
            execInterval: 1,
            amount: 500,
        },
    ]);

    expect(result).toBe(0);
});

test("excludes transactions whose next execution is not in the current month", () => {
    const result = calculateRemainingAutoTransactionSum([
        {
            execOn: 20,
            lastExec: "2025-06-20",
            execInterval: 1,
            amount: 1000,
        },
        {
            execOn: 20,
            lastExec: "2025-04-20",
            execInterval: 1,
            amount: 500,
        },
    ]);

    expect(result).toBe(0);
});

test("returns 0 on the last day of the month", () => {
    vi.setSystemTime(new Date("2025-04-30"));

    const result = calculateRemainingAutoTransactionSum([
        {
            execOn: 31,
            lastExec: "2025-03-31",
            execInterval: 1,
            amount: 1000,
        },
    ]);

    expect(result).toBe(0);
});
