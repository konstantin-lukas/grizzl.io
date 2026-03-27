import { BASE_ACCOUNT, BASE_AUTO_TRANSACTION, BASE_TRANSACTION } from "~~/test-utils/constants/finance";
import { str } from "~~/test-utils/helpers/data";
import { omit } from "~~/test-utils/helpers/object";
import { createInvalidTypeTestCases } from "~~/test-utils/playwright/utils/helpers";

function withAccount(property: keyof typeof BASE_ACCOUNT, value: unknown) {
    return { ...BASE_ACCOUNT, [property]: value };
}

function withTransaction(property: keyof typeof BASE_TRANSACTION, value: unknown) {
    return { ...BASE_TRANSACTION, [property]: value };
}

function withAutoTransaction(property: keyof typeof BASE_AUTO_TRANSACTION, value: unknown) {
    return { ...BASE_AUTO_TRANSACTION, [property]: value };
}

// -------------------- ACCOUNT --------------------

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

export const ACCOUNT_VALID_TITLE_TEST_CASES = [
    ["the title is just long enough", withAccount("title", "a")],
    ["the title is just short enough", withAccount("title", str({ length: 100 }))],
] as const;

const ACCOUNT_VALID_CURRENCY_TEST_CASES = [
    ["the currency is USD", withAccount("currency", "USD")],
    ["the currency is EUR", withAccount("currency", "EUR")],
    ["the currency is JPY", withAccount("currency", "JPY")],
] as const;

export const ACCOUNT_BAD_REQUEST_TEST_CASES = [
    ...ACCOUNT_BAD_TITLE_TEST_CASES,
    ...ACCOUNT_INVALID_TYPE_TEST_CASES,
    ...ACCOUNT_BAD_CURRENCY_TEST_CASES,
];

export const ACCOUNT_VALID_REQUEST_TEST_CASES = [
    ...ACCOUNT_VALID_TITLE_TEST_CASES,
    ...ACCOUNT_VALID_CURRENCY_TEST_CASES,
];

// -------------------- TRANSACTION --------------------
const TRANSACTION_INVALID_TYPE_TEST_CASES = [
    ...createInvalidTypeTestCases(BASE_TRANSACTION, "amount", { valid: ["int"] }),
    ...createInvalidTypeTestCases(BASE_TRANSACTION, "reference", { valid: ["string", "null"] }),
    ...createInvalidTypeTestCases(BASE_TRANSACTION, "categoryId", { valid: ["string"] }),
];

const TRANSACTION_INVALID_DATA_TEST_CASES = [
    ["the amount is too large", withTransaction("amount", BigInt(Number.MAX_SAFE_INTEGER) + 1n)],
    ["the amount is too small", withTransaction("amount", BigInt(Number.MIN_SAFE_INTEGER) - 1n)],
    ["the amount is missing", omit(BASE_TRANSACTION, "amount")],
    ["the reference is empty", withTransaction("amount", "")],
    ["the reference is too long", withTransaction("amount", str({ length: 101 }))],
    ["the categoryId is not valid", withTransaction("categoryId", "pineapples")],
    ["the categoryId is missing", omit(BASE_TRANSACTION, "categoryId")],
] as const;

export const TRANSACTION_VALID_REQUEST_TEST_CASES = [
    ["the amount is just small enough", withTransaction("amount", Number.MAX_SAFE_INTEGER)],
    ["the amount is just large enough", withTransaction("amount", Number.MIN_SAFE_INTEGER)],
    ["the amount is zero", withTransaction("amount", 0)],
    ["the amount is positive", withTransaction("amount", 1)],
    ["the amount is negative", withTransaction("amount", -1)],
    ["the reference is just long enough", withTransaction("reference", "a")],
    ["the reference is just short enough", withTransaction("reference", str({ length: 100 }))],
    ["the categoryId is a valid", withTransaction("categoryId", BASE_TRANSACTION.categoryId)],
] as const;

export const TRANSACTION_BAD_REQUEST_TEST_CASES = [
    ...TRANSACTION_INVALID_TYPE_TEST_CASES,
    ...TRANSACTION_INVALID_DATA_TEST_CASES,
] as const;

// -------------------- AUTO_TRANSACTION --------------------

const AUTO_TRANSACTION_INVALID_TYPE_TEST_CASES = [
    ...createInvalidTypeTestCases(BASE_AUTO_TRANSACTION, "execInterval", { valid: ["int"] }),
    ...createInvalidTypeTestCases(BASE_AUTO_TRANSACTION, "execOn", { valid: ["int"] }),
    ...createInvalidTypeTestCases(BASE_AUTO_TRANSACTION, "lastExec", { valid: ["string"] }),
];

export const AUTO_TRANSACTION_VALID_REQUEST_TEST_CASES = [
    ["the amount is just small enough", withAutoTransaction("amount", Number.MAX_SAFE_INTEGER)],
    ["the amount is just large enough", withAutoTransaction("amount", Number.MIN_SAFE_INTEGER)],
    ["the amount is zero", withAutoTransaction("amount", 0)],
    ["the amount is positive", withAutoTransaction("amount", 1)],
    ["the amount is negative", withAutoTransaction("amount", -1)],
    ["the reference is just long enough", withAutoTransaction("reference", "a")],
    ["the reference is just short enough", withAutoTransaction("reference", str({ length: 100 }))],
    ["the categoryId is valid", withAutoTransaction("categoryId", BASE_AUTO_TRANSACTION.categoryId)],
    ["execInterval is just large enough", withAutoTransaction("execInterval", 1)],
    ["execInterval is just small enough", withAutoTransaction("execInterval", 12)],
    ["execOn is just large enough", withAutoTransaction("execOn", 1)],
    ["execOn is just small enough", withAutoTransaction("execOn", 31)],
    ["lastExec is a valid date", withAutoTransaction("lastExec", "2025-06-30")],
] as const;

export const AUTO_TRANSACTION_BAD_REQUEST_TEST_CASES = [
    ...AUTO_TRANSACTION_INVALID_TYPE_TEST_CASES,
    ["the amount is too large", withAutoTransaction("amount", BigInt(Number.MAX_SAFE_INTEGER) + 1n)],
    ["the amount is too small", withAutoTransaction("amount", BigInt(Number.MIN_SAFE_INTEGER) - 1n)],
    ["the amount is missing", omit(BASE_TRANSACTION, "amount")],
    ["the reference is empty", withAutoTransaction("amount", "")],
    ["the reference is too long", withAutoTransaction("amount", str({ length: 101 }))],
    ["the categoryId is not valid", withAutoTransaction("categoryId", "pineapples")],
    ["the categoryId is missing", omit(BASE_TRANSACTION, "categoryId")],
    ["execInterval is too small", withAutoTransaction("execInterval", 0)],
    ["execInterval is negative", withAutoTransaction("execInterval", -1)],
    ["execInterval is too large", withAutoTransaction("execInterval", 13)],
    ["execOn is too small", withAutoTransaction("execOn", 0)],
    ["execOn is negative", withAutoTransaction("execOn", -1)],
    ["execOn is too large", withAutoTransaction("execOn", 32)],
    ["lastExec is not a correctly formatted date", withAutoTransaction("lastExec", "31.06.2025")],
    ["lastExec is not a valid date", withAutoTransaction("lastExec", "2025-06-31")],
    ["lastExec is not a date at all", withAutoTransaction("lastExec", "bananas")],
] as const;
