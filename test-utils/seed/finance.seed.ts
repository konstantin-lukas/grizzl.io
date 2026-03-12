import { date, int, maybe } from "~~/test-utils/helpers/data";
import { seed } from "~~/test-utils/playwright";

const accountData = [
    { title: "Savings Account", currency: "EUR" },
    { title: "Travel Account", currency: "JPY" },
    { title: "Investment Account", currency: "USD" },
];

const categoryReferences = {
    travel: "Expedia",
    hobbies: "Hobby Lobby",
    partying: "The Tipsy Crow Bar",
    entertainment: "Netflix",
    sports_and_outdoors: "REI",

    groceries: "Walmart",
    food_delivery: "DoorDash",
    eating_out: "Chipotle",

    furniture: "IKEA",
    garden_and_plants: "Home Depot Garden Center",
    home_supplies: "Home Depot",
    personal_care: "CVS Pharmacy",
    pets: "Petco",
    home_repairs: "Lowe's",

    public_transit: "MTA MetroCard",
    bike: "Trek Bicycle Store",
    car: "Chevron Gas Station",
    motorbike: "Harley-Davidson Dealer",

    clothing: "Target",
    electronics: "Best Buy",
    books: "Barnes & Noble",
    gaming: "Steam - Baldur's Gate 3",
    presents: "Amazon Gift Purchase",

    account_transfer: "Transfer to Savings",
    education: "Coursera Course",
    childcare: "Bright Horizons Childcare",
    investments: "Vanguard ETF Purchase",
    donations: "American Red Cross Donation",
    medication: "Walgreens Pharmacy",
    miscellaneous: "PayPal Payment",
};

seed("insert finance test data", async ({ db }) => {
    const accounts = await db.financeAccount.insert(3, index => ({
        title: accountData[index]!.title,
        currency: accountData[index]!.currency,
    }));

    for (const [i, account] of accounts.entries()) {
        if (account.title === "Investment Account") continue;
        const transactions = await db.financeTransaction.insert(50, j => {
            const seed = 50 * i + j;
            const category =
                db.financeTransaction.categories[
                    int({ min: 0, max: db.financeTransaction.categories.length - 1, seed })
                ];
            return {
                accountId: account.id,
                createdAt: date({ refDate: new Date(), seed, days: 45 }),
                category,
                amount: int({ min: account.title === "Travel Account" ? -300_00 : -200_00, max: 300_00, seed }),
                reference: maybe(() => categoryReferences[category as never], { seed }),
            };
        });

        const balance = transactions.reduce((acc, cur) => acc + cur.amount, 0);
        await db.financeAccount.update({ balance }, account.id);

        if (account.title === "Travel Account") continue;
        await db.financeAutoTransaction.insert(10, j => {
            const seed = 10 * i + j;
            const category =
                db.financeTransaction.categories[
                    int({ min: 0, max: db.financeTransaction.categories.length - 1, seed })
                ];
            return {
                accountId: account.id,
                category,
                reference: maybe(() => categoryReferences[category as never], { seed }),
                lastExec: date({ seed, refDate: new Date() }).toISOString().split("T")[0],
            };
        });
    }
});
