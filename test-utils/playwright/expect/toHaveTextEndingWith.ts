import type { Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export default async function toHaveTextEndingWith(loc: Locator, text: string) {
    try {
        await expect
            .poll(async () => {
                const innerText = await loc.innerText();
                return innerText.trim().endsWith(text.trim());
            })
            .toBe(true);
        return {
            pass: true,
            message: () => `Locator has inner text ending with "${text}".`,
        };
    } catch {
        const actualCount = await loc.innerText();
        return {
            pass: false,
            message: () => `Locator does not have inner text ending with "${text}". Actual: "${actualCount}".`,
        };
    }
}
