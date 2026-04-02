import { date, int, maybe } from "~~/test-utils/helpers/data";
import { seed } from "~~/test-utils/playwright";

const accountData = [
    { title: "Savings Account", currency: "EUR" },
    { title: "Travel Account", currency: "JPY" },
    { title: "Investment Account", currency: "USD" },
];

const categoryReferences = {
    // TRAVEL & TRANSPORTATION
    "flight-rounded": "Delta Air Lines Flight",
    "luggage-outline-rounded": "Samsonite Luggage Store",
    "train-outline-rounded": "Amtrak Ticket Purchase",
    "directions-car-outline-rounded": "Hertz Car Rental",
    "pedal-bike-outline-rounded": "Lime Bike Ride",
    "directions-boat-outline-rounded": "Harbor Boat Tour",
    "local-gas-station-outline-rounded": "Shell Gas Station",
    "beach-access-outline-rounded": "Airbnb Beach Stay",

    // FOODS & DRINKS
    "shopping-cart-outline-rounded": "Walmart Grocery",
    "restaurant-rounded": "Chipotle Mexican Grill",
    "coffee-outline-rounded": "Starbucks Coffee",
    "grocery": "Kroger Grocery",
    "bakery-dining-outline": "Panera Bread",
    "beer-meal-outline-rounded": "Local Bar & Grill",
    "cookie-outline-rounded": "Insomnia Cookies",
    "hand-meal-outline-rounded": "DoorDash Order",
    "local-bar-outline-rounded": "Downtown Bar",
    "fastfood-outline-rounded": "McDonalds",

    // ENTERTAINMENT & LEISURE
    "movie-outline-rounded": "AMC Theatres",
    "celebration-outline-rounded": "Party City",
    "sports-esports-outline-rounded": "PlayStation Store",
    "book-ribbon-outline-rounded": "Barnes & Noble",
    "photo-camera-outline-rounded": "Best Buy Camera",
    "chess-knight-outline-rounded": "GameStop Purchase",

    // SPORTS & OUTDOORS
    "sports-tennis-rounded": "Tennis Club Fee",
    "sports-basketball-outline": "Nike Store",
    "sports-baseball-outline": "Sports Authority",
    "golf-course-rounded": "Golf Course Fee",
    "hiking-rounded": "REI Outdoor Gear",
    "pool-rounded": "Community Pool",
    "downhill-skiing-rounded": "Ski Resort Pass",
    "sports-volleyball-outline": "Dick's Sporting Goods",
    "camping-outline-rounded": "Camping World",
    "surfing-rounded": "Surf Shop",

    // HOUSEHOLD
    "house-outline-rounded": "Rent Payment",
    "potted-plant-outline-rounded": "Home Depot Plants",
    "pet-supplies-outline": "Petco",
    "tools-power-drill-outline": "Home Depot Tools",
    "soap-outline-rounded": "CVS Pharmacy",
    "lightbulb-outline-rounded": "Lowe's Lighting",
    "child-friendly-outline-rounded": "Target Toys",
    "household-supplies-outline-rounded": "Costco Wholesale",
    "mode-heat-cool-outline-rounded": "Electric Utility Bill",
    "faucet-outline-rounded": "Water Utility Bill",

    // SHOPPING
    "apparel-outline": "Old Navy",
    "power-plug-outline-rounded": "PG&E Electric",
    "featured-seasonal-and-gifts-rounded": "Amazon Purchase",
    "computer-outline-rounded": "Apple Store",
    "phone-iphone-outline": "AT&T Wireless",

    // OTHER
    "medical-services-outline-rounded": "Urgent Care Visit",
    "question-mark-rounded": "Misc Purchase",
    "monitoring-rounded": "Fidelity Investment",
    "compare-arrows-rounded": "PayPal Transfer",
    "business-center-outline-rounded": "Office Depot",
    "moped-package-outline-rounded": "UPS Shipping",
    "print-outline-rounded": "FedEx Office",
    "router-outline-rounded": "Xfinity Internet",
    "vaping-rooms-rounded": "Smoke Shop",
    "contract-edit-outline-rounded": "Netflix",
    "receipt-long-outline-rounded": "Spotify",
} as const;

seed("insert finance test data", async ({ db }) => {
    const accounts = await db.financeAccount.insert(3, index => ({
        title: accountData[index]!.title,
        currency: accountData[index]!.currency,
    }));

    for (const [i, account] of accounts.entries()) {
        const categories = await db.financeCategory.insert(5, { accountId: account.id });

        if (account.title === "Investment Account") continue;
        const transactions = await db.financeTransaction.insert(50, j => {
            const seed = 50 * i + j;
            const category = categories[int({ min: 0, max: categories.length - 1, seed })]!;
            return {
                accountId: account.id,
                createdAt: date({ refDate: new Date(), seed, days: 45 }),
                categoryId: category.id,
                amount: int({ min: account.title === "Travel Account" ? -300_00 : -200_00, max: 300_00, seed }),
                reference: maybe(() => categoryReferences[category.icon as keyof typeof categoryReferences], { seed }),
            };
        });

        const balance = transactions.reduce((acc, cur) => acc + cur.amount, 0);
        await db.financeAccount.update({ balance }, account.id);

        if (account.title === "Travel Account") continue;
        await db.financeAutoTransaction.insert(10, j => {
            const seed = 10 * i + j;
            const category = categories[int({ min: 0, max: categories.length - 1, seed })]!;
            return {
                accountId: account.id,
                categoryId: category.id,
                reference: maybe(() => categoryReferences[category.icon as keyof typeof categoryReferences], { seed }),
                lastExec: date({ seed, refDate: new Date() }).toISOString().split("T")[0],
            };
        });
    }
});
