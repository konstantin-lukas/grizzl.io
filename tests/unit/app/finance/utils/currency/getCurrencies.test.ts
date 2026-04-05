import { afterEach, expect, test, vi } from "vitest";
import { getCurrencies } from "~/finance/utils/currency";

const OriginalDisplayNames = Intl.DisplayNames;

afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(Intl, "DisplayNames", {
        configurable: true,
        writable: true,
        value: OriginalDisplayNames,
    });
});

test("returns currencies with labels and filters out entries without a display name", () => {
    vi.spyOn(Intl, "supportedValuesOf").mockReturnValue(["USD", "EUR", "XXX"]);

    const of = vi.fn((id: string) => {
        if (id === "XXX") return undefined;
        return `Currency ${id}`;
    });

    const ctorArgs: unknown[][] = [];
    class DisplayNamesMock {
        of = of;
        constructor(...args: unknown[]) {
            ctorArgs.push(args);
        }
    }

    Object.defineProperty(Intl, "DisplayNames", {
        configurable: true,
        writable: true,
        value: DisplayNamesMock,
    });

    const result = getCurrencies("en-US");

    expect(ctorArgs[0]).toEqual(["en-US", { type: "currency" }]);
    expect(result).toEqual([
        { id: "USD", label: "Currency USD (USD)" },
        { id: "EUR", label: "Currency EUR (EUR)" },
    ]);
});

test("returns an empty array when no currencies are available", () => {
    vi.spyOn(Intl, "supportedValuesOf").mockReturnValue([]);

    class DisplayNamesMock {
        of() {
            return undefined;
        }
    }

    Object.defineProperty(Intl, "DisplayNames", {
        configurable: true,
        writable: true,
        value: DisplayNamesMock,
    });

    expect(getCurrencies("de-DE")).toEqual([]);
});
