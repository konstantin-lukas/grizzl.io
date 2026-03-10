import { BASE_ACCOUNT } from "~~/test-utils/constants/finance";
import { str } from "~~/test-utils/helpers/data";
import { omit } from "~~/test-utils/helpers/object";
import { createInvalidTypeTestCases } from "~~/test-utils/playwright/utils/helpers";

function withAccount(property: keyof typeof BASE_ACCOUNT, value: unknown) {
    return { ...BASE_ACCOUNT, [property]: value };
}

const INVALID_TYPE_TEST_CASES = [
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
    ...INVALID_TYPE_TEST_CASES,
    ...ACCOUNT_BAD_CURRENCY_TEST_CASES,
];
