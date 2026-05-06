import { test } from "~~/test-utils/playwright";

test("opens the account specified in localstorage", async ({ db, financePage: page, homePage }) => {
    const [, account2, account3] = await db.financeAccount.insert(20);

    await homePage.goto();
    await page.page.evaluate(id => localStorage.setItem("open-finance-account-id", id), account2.id);
    await page.click("menuButton");
    await page.click("financeLink");

    await page.expect("h1").toHaveText(account2.title);

    await page.page.evaluate(id => localStorage.setItem("open-finance-account-id", id), account3.id);
    await page.page.reload();
    await page.expect("h1").toHaveText(account3.title);
});
