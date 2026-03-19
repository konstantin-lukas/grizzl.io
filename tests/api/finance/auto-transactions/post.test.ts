import { BASE_AUTO_TRANSACTION } from "~~/test-utils/constants/finance";
import { JSONWithBigInt } from "~~/test-utils/helpers/string";
import { expect, test } from "~~/test-utils/playwright";
import {
    test401WhenLoggedOut,
    testPostSubResourceToInvalidParentResource,
} from "~~/test-utils/playwright/utils/helpers";
import {
    AUTO_TRANSACTION_BAD_REQUEST_TEST_CASES,
    AUTO_TRANSACTION_VALID_REQUEST_TEST_CASES,
} from "~~/test-utils/playwright/utils/helpers/finance";

const route = (id: string) => `/api/finance/accounts/${id}/auto-transactions`;

test401WhenLoggedOut("post", route("2222222222222222"));
testPostSubResourceToInvalidParentResource(id => route(id), "financeAccount", BASE_AUTO_TRANSACTION);

for (const [name, data] of AUTO_TRANSACTION_BAD_REQUEST_TEST_CASES) {
    test(`rejects creating resources when ${name}`, async ({ request, db }) => {
        const [account] = await db.financeAccount.insert(1);
        const response = await request.post(route(account.id), {
            data: JSONWithBigInt(data),
        });
        expect(response.status()).toBe(400);
    });
}

for (const [name, data] of AUTO_TRANSACTION_VALID_REQUEST_TEST_CASES) {
    test(`allows creating resources when ${name}`, async ({ request, db }) => {
        const [account] = await db.financeAccount.insert(1);
        const response = await request.post(route(account.id), { data });
        const responseData = response.headers().location;
        expect(response.status()).toBe(201);
        const { id, createdAt, deletedAt, accountId, ...rest } = (await db.financeAutoTransaction.select())[0]!;
        expect(rest).toStrictEqual({ ...data });
        expect(responseData).toBe(`${route(account.id)}/${id}`);
    });
}
