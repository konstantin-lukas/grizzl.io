import { AxeBuilder } from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import config from "~~/playwright.config";

export default async function toBeAccessible(page: Page) {
    try {
        const timeout = config.expect?.timeout ?? 5000;
        const axe = new AxeBuilder({ page })
            .exclude("#nuxt-devtools-container")
            .exclude("[aria-hidden]")
            .exclude("[data-hidden]");
        const start = Date.now();
        while (true) {
            const results = await axe.analyze();
            if (results.violations.length === 0 || Date.now() - start > timeout) {
                expect(results.violations).toEqual([]);
                break;
            }
            await new Promise(resolve => {
                setTimeout(resolve, 50);
            });
        }
        return {
            pass: true,
            message: () => "Page does not contain any automatically detectable accessibility issues.",
        };
    } catch {
        return {
            pass: false,
            message: () => "Page contains automatically detectable accessibility issues.",
        };
    }
}
