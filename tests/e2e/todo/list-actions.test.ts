import { expect, test } from "~~/test-utils/playwright";
import { SCREENSHOT } from "~~/test-utils/playwright/tags";

test("allows creating new items and persists changes", { tag: SCREENSHOT }, async ({ todoPage: page, db }) => {
    await db.todoList.insert(1);
    await page.goto();

    await page.click("openListButtons");
    await page.expect("notSyncing").toBeAttached();

    await page.expect().toBeValid({ name: "empty-todo-list-modal", skipThemeToggle: true, blur: false });

    await page.click("addItem");

    await page.syncAndReload();
    await page.click("notSyncing");

    await page.expect().toHaveScreenshot({ name: "todo-list-modal-with-one-item", blur: false });
});

test("allows editing an item's text and persists changes", async ({ todoPage: page, db }) => {
    const [list] = await db.todoList.insert(1);
    await db.todoListItem.insert(1, { listId: list.id });

    await page.goto();

    await page.click("openListButtons");
    await page.focus("textInputs");
    await page.fill("textInputs", "Bananas");

    await page.syncAndReload();
    await page.click("notSyncing");

    await page.expect("textInputs").toHaveValue("Bananas");
});

test("allows deleting an item and persists changes", { tag: SCREENSHOT }, async ({ todoPage: page, db }) => {
    const [list] = await db.todoList.insert(1);
    await db.todoListItem.insert(1, { listId: list.id });

    await page.goto();

    await page.click("openListButtons");
    await page.click("deleteButtons");

    await page.syncAndReload();
    await page.click("notSyncing");

    await page.expect().toHaveScreenshot({ name: "empty-todo-list-modal", threshold: 0.01, blur: false });
});

for (const [action, ordering, checkbox] of [
    ["completing", "sorts it alphabetically", 0],
    ["uncompleting", "puts it at the end", 3],
] as const) {
    test(
        `allows ${action} an item, ${ordering} and persists changes`,
        { tag: SCREENSHOT },
        async ({ todoPage: page, db }) => {
            const [list] = await db.todoList.insert(1);
            await db.todoListItem.insert(5, index => ({ listId: list.id, index: index > 2 ? null : index }));

            await page.goto();

            await page.click("openListButtons");
            await page.expect("notSyncing").toBeAttached();

            await page.click("accordion");
            await page.expect().toHaveScreenshot({
                name: "todo-list-modal-before-changing-an-items-completed-status",
                blur: false,
            });
            await page.click("checkboxes", { nth: checkbox });

            await page.syncAndReload();
            await page.click("accordion");
            await page.click("notSyncing");

            await page.expect().toHaveScreenshot({
                name: `todo-list-modal-after-${action}-an-item`,
                blur: false,
                maxDiffPixelRatio: 0.01,
            });
        },
    );
}

test("reverts local changes if syncing fails", { tag: SCREENSHOT }, async ({ todoPage: page, db }) => {
    await db.todoList.insert(1);

    await page.goto();

    await page.click("openListButtons");

    const abort = await page.page.route("/api/todo/**", route => route.abort());

    await page.click("addItem");

    await page.waitForSync();
    await page.click("closeToastButton");
    await page.expect().toHaveScreenshot({ name: "empty-todo-list-modal", threshold: 0.01, blur: false });

    await abort.dispose();
    await page.page.reload();
    await page.click("notSyncing");
    await page.expect().toHaveScreenshot({ name: "empty-todo-list-modal", threshold: 0.01, blur: false });
});

test("allows splitting items by pressing enter", { tag: SCREENSHOT }, async ({ todoPage: page, db }) => {
    const [list] = await db.todoList.insert(1);
    await db.todoListItem.insert(1, { listId: list.id });

    await page.goto();
    await page.click("openListButtons");

    await page.focus("textInputs");
    await page.page.keyboard.press("ArrowLeft");
    await page.page.keyboard.press("Enter");

    await page.syncAndReload();
    await page.click("notSyncing");
    await page.expect().toHaveScreenshot({ name: "todo-list-after-splitting-an-item", blur: false });
});

test(
    "allows merging items by pressing backspace when caret is at leftmost position",
    { tag: SCREENSHOT },
    async ({ todoPage: page, db }) => {
        const [list] = await db.todoList.insert(1);
        await db.todoListItem.insert(2, index => ({ listId: list.id, text: index.toString() }));

        await page.goto();
        await page.click("openListButtons");

        await page.focus("textInputs", { nth: 1 });
        await page.page.keyboard.press("ArrowLeft");
        await page.page.keyboard.press("Backspace");
        await page.syncAndReload();

        await page.click("notSyncing");
        await page.expect().toHaveScreenshot({ name: "todo-list-after-merging-items", blur: false });
    },
);

test("allows moving items via drag-and-drop", { tag: SCREENSHOT }, async ({ todoPage: page, db }) => {
    const [list] = await db.todoList.insert(1);
    await db.todoListItem.insert(5, { listId: list.id });

    await page.goto();
    await page.click("openListButtons");
    await page.expect().toHaveScreenshot({ name: "todo-list-before-drag-and-drop", blur: false, threshold: 0.01 });

    await page.locators.dragHandles.nth(0).dragTo(page.locators.dragHandles.nth(3));
    await page.syncAndReload();

    await page.click("notSyncing");
    await page.expect().toHaveScreenshot({ name: "todo-list-after-drag-and-drop", blur: false });
});

test("does not allow merging items when the combined item length is too large", async ({ todoPage: page, db }) => {
    const [list] = await db.todoList.insert(1);
    await db.todoListItem.insert(2, { listId: list.id });

    await page.goto();
    await page.click("openListButtons");
    await page.focus("textInputs", { nth: 1 });
    await page.page.keyboard.press("ArrowUp");
    await page.page.keyboard.press("Backspace");

    await expect.poll(() => page.dialog?.type()).toBe("alert");
    await expect
        .poll(() => page.dialog?.message())
        .toBe("You can't merge this item with the previous one because the resulting text exceeds the maximum.");
});

test("warns the user when trying to leave the page before synchronization has finished", async ({
    todoPage: page,
    db,
}) => {
    const [list] = await db.todoList.insert(1);
    await db.todoListItem.insert(1, { listId: list.id });

    await page.page.route("/api/todo/actions", route => setTimeout(() => route.continue(), 10000));
    await page.goto();
    await page.click("openListButtons");
    await page.fill("textInputs", "Bananas");
    await page.expect("syncing").toBeAttached();

    await page.page.close({ runBeforeUnload: true });
    await expect.poll(() => page.dialog?.type()).toBe("beforeunload");
});

test("does not allow adding an item when the list is full", async ({ todoPage: page, db }) => {
    const [list] = await db.todoList.insert(1);
    await db.todoListItem.insert<number>(1000, { listId: list.id });
    await page.goto();
    await page.click("openListButtons");
    await page.expect("addItem").toBeDisabled();
});

test("does not allow splitting an item when the list is full", async ({ todoPage: page, db }) => {
    const [list] = await db.todoList.insert(1);
    await db.todoListItem.insert<number>(1000, { listId: list.id });
    await page.goto();
    await page.click("openListButtons");
    await page.focus("textInputs", { nth: 0 });
    await page.page.keyboard.press("Enter");
    await expect.poll(() => page.dialog?.type()).toBe("alert");
    await expect.poll(() => page.dialog?.message()).toBe("You can't add any more items. This list is full.");
});

test(
    "provides a case-insensitive auto complete suggestions based on completed tasks",
    { tag: SCREENSHOT },
    async ({ todoPage: page, db }) => {
        const [list] = await db.todoList.insert(1);
        const texts = ["Bananas", "Blueberries", "Watermelon"];
        await db.todoListItem.insert(3, index => ({ listId: list.id, index: null, text: texts[index] }));
        await page.goto();
        await page.click("openListButtons");
        await page.click("addItem");
        await page.fill("textInputs", "b", { nth: 0 });
        await page.waitForSync();
        await page.expect().toHaveScreenshot({ name: "todo-list-with-autocomplete-suggestions", blur: false });
    },
);
