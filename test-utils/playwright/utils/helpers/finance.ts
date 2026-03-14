import { BASE_ACCOUNT, BASE_TRANSACTION } from "~~/test-utils/constants/finance";
import type { DBFixtures } from "~~/test-utils/database/fixture";
import { str } from "~~/test-utils/helpers/data";
import { omit } from "~~/test-utils/helpers/object";
import { createInvalidTypeTestCases } from "~~/test-utils/playwright/utils/helpers";

function withAccount(property: keyof typeof BASE_ACCOUNT, value: unknown) {
    return { ...BASE_ACCOUNT, [property]: value };
}

function withTransaction(property: keyof typeof BASE_TRANSACTION, value: unknown) {
    return { ...BASE_TRANSACTION, [property]: value };
}

const ACCOUNT_INVALID_TYPE_TEST_CASES = [
    ...createInvalidTypeTestCases(BASE_ACCOUNT, "title", { valid: ["string"] }),
    ...createInvalidTypeTestCases(BASE_ACCOUNT, "currency", { valid: ["int"] }),
];

const ACCOUNT_BAD_CURRENCY_TEST_CASES = [
    ["the currency is too short", withAccount("currency", "US")],
    ["the currency is too long", withAccount("currency", "USDA")],
    ["the currency contains lowercase letters", withAccount("currency", "usd")],
    ["the currency contains numbers", withAccount("currency", "U2D")],
    ["the currency is missing", omit(BASE_ACCOUNT, "currency")],
];

export const ACCOUNT_BAD_TITLE_TEST_CASES = [
    ["the title is empty", withAccount("title", "")],
    ["the title is too long", withAccount("title", str({ length: 101 }))],
    ["the title is missing", omit(BASE_ACCOUNT, "title")],
];

export const ACCOUNT_BAD_REQUEST_TEST_CASES = [
    ...ACCOUNT_BAD_TITLE_TEST_CASES,
    ...ACCOUNT_INVALID_TYPE_TEST_CASES,
    ...ACCOUNT_BAD_CURRENCY_TEST_CASES,
];

const TRANSACTION_INVALID_TYPE_TEST_CASES = [
    ...createInvalidTypeTestCases(BASE_TRANSACTION, "amount", { valid: ["int"] }),
    ...createInvalidTypeTestCases(BASE_TRANSACTION, "reference", { valid: ["string", "null"] }),
    ...createInvalidTypeTestCases(BASE_TRANSACTION, "category", { valid: ["string"] }),
];

const TRANSACTION_INVALID_DATA_TEST_CASES = [
    ["the amount is too large", withTransaction("amount", BigInt(Number.MAX_SAFE_INTEGER) + 1n)],
    ["the amount is too small", withTransaction("amount", BigInt(Number.MIN_SAFE_INTEGER) - 1n)],
    ["the amount is missing", omit(BASE_TRANSACTION, "amount")],
    ["the reference is empty", withTransaction("amount", "")],
    ["the reference is too long", withTransaction("amount", str({ length: 101 }))],
    ["the category is not a valid enum value", withTransaction("category", "pineapples")],
    ["the category is missing", omit(BASE_TRANSACTION, "category")],
];

export const TRANSACTION_BAD_REQUEST_TEST_CASES = [
    ...TRANSACTION_INVALID_TYPE_TEST_CASES,
    ...TRANSACTION_INVALID_DATA_TEST_CASES,
];

export async function buildTransactions(db: DBFixtures, options: object) {
    const accounts = await db.financeAccount.insert(1, options);
    for (const account of accounts) {
        await db.financeTransaction.insert(3, { ...options, accountId: account.id });
    }
}
