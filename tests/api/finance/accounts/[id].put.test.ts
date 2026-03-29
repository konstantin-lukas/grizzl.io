import { expect, test } from "~~/test-utils/playwright";
import {
    ACCOUNT_BAD_TITLE_TEST_CASES,
    ACCOUNT_VALID_TITLE_TEST_CASES,
    makeAccountTestBuilder,
} from "~~/test-utils/playwright/utils/helpers/finance";

const route = "/api/finance/accounts";

const testBuilder = makeAccountTestBuilder("put");

testBuilder
    .returnsA404StatusCodeWhenTheProvidedIdIsUnknown()
    .returnsA400StatusCodeWhenTheProvidedIdHasTheWrongFormat()
    .returnsA401StatusCodeWhenAnUnauthenticatedRequestIsMade()
    .build();

for (const [name, data] of ACCOUNT_BAD_TITLE_TEST_CASES) {
    test(`rejects updating resources when ${name}`, async ({ request, db }) => {
        await db.financeAccount.insert(1);
        const [insertedData] = await db.financeAccount.select();
        const response = await request.put(`${route}/${insertedData!.id}`, { data });
        expect(response.status()).toBe(400);
    });
}

for (const [name, data] of ACCOUNT_VALID_TITLE_TEST_CASES) {
    test(`allows updating resources when ${name}`, async ({ request, db }) => {
        const [insertedData] = await db.financeAccount.insert(1);
        const response = await request.put(`${route}/${insertedData.id}`, { data });
        expect(response.status()).toBe(204);
        const { id, userId, createdAt, deletedAt, ...rest } = (await db.financeAccount.select())[0]!;
        expect(rest).toStrictEqual({ ...data, balance: 0, currency: insertedData.currency });
    });
}
