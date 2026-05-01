import { date } from "~~/test-utils/helpers/data";
import { test } from "~~/test-utils/playwright";
import { SCREENSHOT } from "~~/test-utils/playwright/tags";

const refDate = new Date("2026-04-15T12:00:00Z");

test("displays account balance changes over time", { tag: SCREENSHOT }, async ({ financePage: page, db }) => {
    const [account] = await db.financeAccount.insert(1);
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    const transactions = await db.financeTransaction.insert(50, seed => ({
        createdAt: date({ seed, refDate, days: 30 }),
        accountId: account.id,
        categoryId: category.id,
    }));
    const sum = transactions.reduce((acc, { amount }) => acc + amount, 0);
    await db.financeAccount.update({ balance: sum }, account.id);
    await page.page.clock.install({ time: refDate });
    await page.goto();
    await page.expect("balanceChart").toBeValid({ name: "balance-chart" });
});

test("uses auto-transactions to predict account balance at the end of the month", async ({ financePage: page, db }) => {
    const [account] = await db.financeAccount.insert(1);
    const [category] = await db.financeCategory.insert(1, { accountId: account.id });
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    const lastExec = new Date(year, month, 0).toISOString().split("T")[0]!;
    const autoTransactions = await db.financeAutoTransaction.insert(50, {
        lastExec,
        accountId: account.id,
        categoryId: category.id,
        execInterval: 1,
        execOn: 31,
    });
    const relenvantAutoTransactions = autoTransactions.filter(autoTransaction => {
        const [, month, day] = autoTransaction.lastExec.split("-").map(Number);
        const today = new Date();
        return month === today.getMonth() && day! > today.getDate();
    });
    const sum = relenvantAutoTransactions.reduce((acc, { amount }) => acc + amount, 0);
    const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EUR",
    }).format(sum / 100);

    await page.goto();
    await page.expect("balanceChart").toHaveTextEndingWith(formatted);
});
