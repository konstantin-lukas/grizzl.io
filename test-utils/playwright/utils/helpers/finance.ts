import { BASE_ACCOUNT } from "~~/test-utils/constants/finance";
import { str } from "~~/test-utils/helpers/data";
import { omit } from "~~/test-utils/helpers/object";
import { createInvalidTypeTestCases } from "~~/test-utils/playwright/utils/helpers";

function withAccount(property: keyof typeof BASE_ACCOUNT, value: unknown) {
    return { ...BASE_ACCOUNT, [property]: value };
}

const invalidTypeCases = [
    ...createInvalidTypeTestCases(BASE_ACCOUNT, "title", { valid: ["string"] }),
    ...createInvalidTypeTestCases(BASE_ACCOUNT, "balance", { valid: ["string"] }),
    ...createInvalidTypeTestCases(BASE_ACCOUNT, "currency", { valid: ["int"] }),
];

const invalidValueTestCases = [
    ["the title is empty", withAccount("title", "")],
    ["the title is too long", withAccount("title", str({ length: 101 }))],
    ["the title is missing", omit(BASE_ACCOUNT, "title")],
    ["the currency is too short", withAccount("currency", "US")],
    ["the currency is too long", withAccount("currency", "USDA")],
    ["the currency contains lowercase letters", withAccount("currency", "usd")],
    ["the currency is missing", omit(BASE_ACCOUNT, "currency")],
];

export const ACCOUNT_BAD_REQUEST_TEST_CASES = [...invalidTypeCases, ...invalidValueTestCases];
