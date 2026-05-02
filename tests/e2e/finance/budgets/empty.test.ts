import { test } from "~~/test-utils/playwright";
import { SCREENSHOT } from "~~/test-utils/playwright/tags";

test(
    "shows a correct empty state when there are no expenses or budgets",
    { tag: SCREENSHOT },
    async ({ financePage: page, db }) => {
        await db.financeAccount.insert(1);
        await page.page.clock.install({ time: "2026-05-15" });
        await page.goto();
        await page.click("tabs", { nth: 1 });
        await page.expect().toBeValid({ name: "empty-view" });
    },
);
