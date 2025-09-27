import type { Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export default async function toBeDisattached(loc: Locator) {
    try {
        await expect(loc).not.toBeAttached();
        return {
            pass: true,
            message: () => "Locator was not attached.",
        };
    } catch {
        return {
            pass: false,
            message: () => "Locator was attached. Expected it not to be.",
        };
    }
}
