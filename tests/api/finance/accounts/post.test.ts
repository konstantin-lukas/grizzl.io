import { BASE_ACCOUNT } from "~~/test-utils/constants/finance";
import { expect, test } from "~~/test-utils/playwright";
import { test401WhenLoggedOut, testPostIgnoresUserId } from "~~/test-utils/playwright/utils/helpers";
import {
    ACCOUNT_BAD_REQUEST_TEST_CASES,
    ACCOUNT_VALID_REQUEST_TEST_CASES,
} from "~~/test-utils/playwright/utils/helpers/finance";

const route = "/api/finance/accounts";

test401WhenLoggedOut("post", route);
testPostIgnoresUserId(route, "financeAccount", BASE_ACCOUNT);

for (const [name, data] of ACCOUNT_BAD_REQUEST_TEST_CASES) {
    test(`rejects creating resources when ${name}`, async ({ request }) => {
        const response = await request.post(route, { data });
        expect(response.status()).toBe(400);
    });
}

for (const [name, data] of ACCOUNT_VALID_REQUEST_TEST_CASES) {
    test(`allows creating resources when ${name}`, async ({ request, db }) => {
        const response = await request.post(route, { data });
        const responseData = response.headers().location;
        expect(response.status()).toBe(201);
        const { id, createdAt, deletedAt, userId, ...rest } = (await db.financeAccount.select())[0]!;
        expect(rest).toStrictEqual({ ...data, balance: 0 });
        expect(responseData).toBe(`${route}/${id}`);
    });
}
