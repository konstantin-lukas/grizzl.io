import { expect, test } from "~~/test-utils/playwright";

test("allows creating new presets", async ({ todoPage: page, db }) => {
    const [list] = await db.todoList.insert(1);
    const items = await db.todoListItem.insert(1, { listId: list.id }).then(data => data.map(item => item.text));

    const title = "Bananas";

    await page.goto();
    await page.click("openListButtons");
    await page.click("optionsButton");

    await page.fill("presetTitleInput", title);
    await page.click("presetSaveButton");

    await page.expect("presetApplyButtons").toHaveCount(1);
    await page.expect("presetDeleteButtons").toHaveCount(1);
    await page.expect("presetTitles").toHaveText(title);

    const [preset] = await db.todoPreset.select();
    expect(preset).toMatchObject({ title, items, listId: list.id });
});

test("allows changing the list's title", async ({ todoPage: page, db }) => {
    const [list] = await db.todoList.insert(1);
    const title = "Dog Food";
    const icon = "pet-supplies-outline";

    await page.goto();
    await page.click("openListButtons");
    await page.click("optionsButton");

    await page.fill("titleInput", title);
    await page.expect("categorySelect").toHaveAttribute("data-icon", icon);
    await page.page.keyboard.press("Escape");
    await page.expect("listTitle").toHaveText(title);

    await page.click("closeButton");
    await page.expect("listCardTitles").toHaveText(title);
    await page
        .expect("categoryIcon")
        .toHaveAttribute("class", expect.stringContaining("i-material-symbols:pet-supplies-outline"));

    const [updatedList] = await db.todoList.select(list.id);
    expect(updatedList).toHaveProperty("title", title);
    expect(updatedList).toHaveProperty("icon", icon);
});

test("allows deleting a list", async ({ todoPage: page, db }) => {
    await db.todoList.insert(2);

    await page.goto();
    await page.expect("listCardTitles").toHaveCount(2);
    await page.click("openListButtons", { nth: 0 });
    await page.expect("modal").toBeAttached();
    await page.click("optionsButton");

    await page.click("listDeleteButton");
    await page.expect("listCardTitles").toHaveCount(1);
    await page.expect("modal").toBeDisattached();
    await page.expect("closeToastButton").toBeAttached();
});

test("marks completed items as uncompleted when applying a preset", async ({ todoPage: page, db }) => {
    const [list] = await db.todoList.insert(1);
    await db.todoListItem.insert(3, index => ({ text: index.toString(), listId: list.id, index: null }));
    await db.todoPreset.insert(1, { items: ["1", "2", "3"], listId: list.id });

    await page.goto();
    await page.applyPreset(0);

    await page.expect("textInputs", { nth: 0 }).toHaveValue("1");
    await page.expect("textInputs", { nth: 1 }).toHaveValue("2");
    await page.expect("textInputs", { nth: 2 }).toHaveValue("3");

    await page.click("accordion");
    await page.expect("completedTexts").toHaveText("0");
});

test("creates items when they are missing from the list", async ({ todoPage: page, db }) => {
    const [list] = await db.todoList.insert(1);
    await db.todoListItem.insert(3, index => ({ text: index.toString(), listId: list.id, index: null }));
    await db.todoPreset.insert(1, { items: ["3", "4", "5"], listId: list.id });

    await page.goto();
    await page.applyPreset(0);

    await page.expect("textInputs", { nth: 0 }).toHaveValue("3");
    await page.expect("textInputs", { nth: 1 }).toHaveValue("4");
    await page.expect("textInputs", { nth: 2 }).toHaveValue("5");

    await page.click("accordion");
    await page.expect("completedTexts", { nth: 0 }).toHaveText("0");
    await page.expect("completedTexts", { nth: 1 }).toHaveText("1");
    await page.expect("completedTexts", { nth: 2 }).toHaveText("2");
});

test("only inserts each item once even when there are duplicates in the preset", async ({ todoPage: page, db }) => {
    const [list] = await db.todoList.insert(1);
    await db.todoPreset.insert(1, { items: ["0", "0", "0"], listId: list.id });

    await page.goto();
    await page.applyPreset(0);

    await page.expect("textInputs").toHaveValue("0");
    await page.expect("accordion").toBeDisattached();
});

test("leaves existing uncompleted items untouched and appends to end of list when there are already items in the list", async ({
    todoPage: page,
    db,
}) => {
    const [list] = await db.todoList.insert(1);
    await db.todoListItem.insert(2, index => ({ text: index.toString(), listId: list.id }));
    await db.todoPreset.insert(1, { items: ["1", "2"], listId: list.id });

    await page.goto();
    await page.applyPreset(0);

    await page.expect("textInputs", { nth: 0 }).toHaveValue("0");
    await page.expect("textInputs", { nth: 1 }).toHaveValue("1");
    await page.expect("textInputs", { nth: 2 }).toHaveValue("2");
    await page.expect("accordion").toBeDisattached();
});

test("allows deleting presets", async ({ todoPage: page, db }) => {
    const [list] = await db.todoList.insert(1);
    await db.todoPreset.insert(1, { listId: list.id });

    await page.goto();
    await page.click("openListButtons");
    await page.click("optionsButton");
    await page.click("presetDeleteButtons");
    await page.expect("presetTitles").toBeDisattached();

    await expect.poll(async () => (await db.todoPreset.select())[0]).toHaveProperty("deletedAt", expect.any(Date));
});

test("allows aborting preset application", async ({ todoPage: page, db }) => {
    const [list] = await db.todoList.insert(1);
    await db.todoPreset.insert(1, { listId: list.id });

    await page.goto();
    await page.click("openListButtons");
    await page.click("optionsButton");
    await page.click("presetApplyButtons");
    await page.click("presetApplyCancelButton");

    await page.page.keyboard.press("Escape");
    await page.expect("textInputs").toHaveCount(0);
});
