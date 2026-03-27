export const BASE_ACCOUNT = {
    title: "Travel Account",
    currency: "JPY",
    balance: 1_000_000,
};

export const FULL_ACCOUNT = {
    ...BASE_ACCOUNT,
    id: "VbvbykXQUeBBs5n8",
    userId: "VbvbykXQUeBBs5n8",
    createdAt: new Date("1999-12-31"),
    deleted: false,
};

export const BASE_TRANSACTION = {
    amount: 100_00,
    reference: "Fresh Fruit",
    categoryId: "VbvbykXQUeBBs5n8",
};

export const FULL_TRANSACTION = {
    ...BASE_TRANSACTION,
    id: "VbvbykXQUeBBs5n8",
    accountId: "VbvbykXQUeBBs5n8",
    createdAt: new Date("1999-12-31"),
    deleted: false,
};

export const BASE_AUTO_TRANSACTION = {
    amount: -20_99,
    reference: "Rent",
    execInterval: 1,
    execOn: 1,
    lastExec: "2026-01-01",
    categoryId: "VbvbykXQUeBBs5n8",
};

export const FULL_AUTO_TRANSACTION = {
    ...BASE_AUTO_TRANSACTION,
    id: "VbvbykXQUeBBs5n8",
    accountId: "VbvbykXQUeBBs5n8",
    createdAt: new Date("2026-01-01"),
};

export const BASE_CATEGORY = {
    displayName: "Groceries",
    normalizedName: "groceries",
    icon: "grocery",
};

export const FULL_CATEGORY = {
    id: "VbvbykXQUeBBs5n8",
    accountId: "VbvbykXQUeBBs5n8",
};
