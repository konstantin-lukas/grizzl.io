import { Category } from "#shared/finance/enums/category.enum";

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
    category: Category.GROCERIES,
};

export const FULL_TRANSACTION = {
    ...BASE_TRANSACTION,
    id: "VbvbykXQUeBBs5n8",
    accountId: "VbvbykXQUeBBs5n8",
    userId: "VbvbykXQUeBBs5n8",
    createdAt: new Date("1999-12-31"),
    deleted: false,
};
