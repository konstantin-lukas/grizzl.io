import { expect, test } from "vitest";
import { calculateAccountBalanceTimeSeries } from "~/finance/utils/balance";

test("returns an empty array when no dates are provided", () => {
    const result = calculateAccountBalanceTimeSeries(
        1000,
        [{ amount: 200, createdAt: "2025-06-01T10:00:00.000Z" }],
        [],
    );

    expect(result).toEqual([]);
});

test("returns the start balance for each date when there are no transactions", () => {
    const dates = [new Date("2025-06-01T00:00:00.000Z"), new Date("2025-06-02T00:00:00.000Z")];

    const result = calculateAccountBalanceTimeSeries(1000, [], dates);

    expect(result).toEqual([1000, 1000]);
});

test("adds all transactions that occur on the same day and carries balance forward", () => {
    const dates = [
        new Date("2025-06-01T00:00:00.000Z"),
        new Date("2025-06-02T00:00:00.000Z"),
        new Date("2025-06-03T00:00:00.000Z"),
    ];

    const transactions = [
        { amount: 200, createdAt: "2025-06-01T08:00:00.000Z" },
        { amount: -50, createdAt: "2025-06-01T19:00:00.000Z" },
        { amount: 300, createdAt: "2025-06-03T12:00:00.000Z" },
    ];

    const result = calculateAccountBalanceTimeSeries(1000, transactions, dates);

    expect(result).toEqual([1150, 1150, 1450]);
});

test("ignores transactions whose dates are not included in the requested dates", () => {
    const dates = [new Date("2025-06-02T00:00:00.000Z"), new Date("2025-06-03T00:00:00.000Z")];

    const transactions = [
        { amount: 999, createdAt: "2025-06-01T10:00:00.000Z" },
        { amount: 100, createdAt: "2025-06-02T10:00:00.000Z" },
        { amount: -25, createdAt: "2025-06-03T10:00:00.000Z" },
    ];

    const result = calculateAccountBalanceTimeSeries(500, transactions, dates);

    expect(result).toEqual([600, 575]);
});

test("respects the order of the provided dates when computing the running balance", () => {
    const dates = [new Date("2025-06-03T00:00:00.000Z"), new Date("2025-06-01T00:00:00.000Z")];

    const transactions = [
        { amount: 10, createdAt: "2025-06-01T10:00:00.000Z" },
        { amount: 20, createdAt: "2025-06-03T10:00:00.000Z" },
    ];

    const result = calculateAccountBalanceTimeSeries(100, transactions, dates);

    expect(result).toEqual([120, 130]);
});
