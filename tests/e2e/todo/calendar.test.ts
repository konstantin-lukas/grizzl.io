import { test } from "~~/test-utils/playwright";
import { SCREENSHOT } from "~~/test-utils/playwright/tags";

const refDate = "2020-05-15";

for (const [action, ordering, item] of [
    ["completing", "sorts it alphabetically", 0],
    ["uncompleting", "puts it at the end", 3],
    ["deleting", "", 0],
] as const) {
    test(
        `allows ${action} an item ${ordering} and persists changes`,
        { tag: SCREENSHOT },
        async ({ todoPage: page, db }) => {
            const [list] = await db.todoList.insert(1);
            await db.todoListItem.insert(5, index => ({
                listId: list.id,
                index: index > 2 ? null : index,
                scheduledFor: refDate,
            }));

            const target = action === "deleting" ? "deleteButtons" : "checkboxes";

            await page.page.clock.install({ time: refDate });
            await page.goto({ target: "/todo/calendar" });
            await page.click("accordion");

            await page.expect(target, { nth: item }).toBeVisible();
            await page.expect().toBeValid({
                name: "todo-calendar-before-changing-an-item",
                blur: false,
                skipThemeToggle: true,
                maxDiffPixelRatio: 0.01,
            });

            await page.click(target, { nth: item });
            await page.syncAndReload();
            await page.click("accordion");

            await page.expect(target, { nth: item }).toBeVisible();
            await page.expect().toHaveScreenshot({
                name: `todo-calendar-after-${action}-an-item`,
                blur: false,
                maxDiffPixelRatio: 0.01,
            });
        },
    );
}

test(
    "allows switching between dates and shows an empty view when there are no todos",
    { tag: SCREENSHOT },
    async ({ todoPage: page, db }) => {
        const [list] = await db.todoList.insert(1);
        await db.todoListItem.insert(5, { listId: list.id, scheduledFor: refDate });

        await page.page.clock.install({ time: refDate });
        await page.goto({ target: "/todo/calendar" });
        await page.page.locator('[data-date="2020-05-16"]').click();

        await page.expect().toBeValid({
            name: "todo-calendar-empty",
            maxDiffPixelRatio: 0.01,
        });
    },
);
