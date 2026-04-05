import { expect, test } from "vitest";
import { formatCurrency } from "~/finance/utils/currency";

test("formats USD from minor units (cents) to major units", () => {
    expect(formatCurrency("en-US", "USD", 1234)).toBe("$12.34");
});

test("formats negative USD amounts correctly", () => {
    expect(formatCurrency("en-US", "USD", -1234)).toBe("-$12.34");
});

test("does not divide zero-decimal currencies like JPY", () => {
    expect(formatCurrency("en-US", "JPY", 1234)).toBe("¥1,234");
});
