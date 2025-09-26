import { AxeBuilder } from "@axe-core/playwright";
import type { Locator, Page } from "@playwright/test";

import { expect } from "@e2e/fixture";

export default abstract class BasePage<T extends Record<string, string>> {
    private readonly page;
    readonly loc;
    readonly url;
    protected constructor(page: Page, locators: T, url: string) {
        this.page = page;
        this.loc = Object.fromEntries(
            Object.entries(locators).map(([key, value]) => [key, page.getByTestId(value)]),
        ) as Record<keyof T, Locator>;
        this.url = url;
    }

    async goto(options?: {
        referer?: string;
        timeout?: number;
        waitUntil?: "load" | "domcontentloaded" | "networkidle";
    }) {
        await this.page.goto(this.url, options);
    }

    async all(key: keyof typeof this.loc) {
        const locator = this.loc[key];
        await expect(locator).toHaveCountGreaterThan(0);
        return await locator.all();
    }

    async forEach(key: keyof typeof this.loc, callback: (locator: Locator, index: number) => Promise<void>) {
        const all = await this.all(key);
        for (const [index, locator] of all.entries()) {
            await callback(locator, index);
        }
    }

    async analyzeA11y() {
        const axe = new AxeBuilder({ page: this.page });
        const start = Date.now();
        while (true) {
            const results = await axe.analyze();
            if (results.violations.length === 0 || Date.now() - start > 30000) {
                expect(results.violations).toEqual([]);
                break;
            }
            await new Promise(resolve => {
                setTimeout(resolve, 50);
            });
        }
    }
}
