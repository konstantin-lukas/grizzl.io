import type { Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export default async function toHaveCountGreaterThan(loc: Locator, count: number) {
    try {
        await expect(loc.nth(count)).toBeAttached();
        return {
            pass: true,
            message: () => `Locator resolved to more than ${count} elements.`,
        };
    } catch {
        const actualCount = await loc.count();
        return {
            pass: false,
            message: () => `Locator resolved to ${actualCount} elements. Expected more than ${count} elements.`,
        };
    }
}
