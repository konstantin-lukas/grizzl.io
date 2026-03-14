import { BASE_ACCOUNT } from "~~/test-utils/constants/finance";
import { expect, test } from "~~/test-utils/playwright";
import { test401WhenLoggedOut } from "~~/test-utils/playwright/utils/helpers";
import { ACCOUNT_BAD_REQUEST_TEST_CASES } from "~~/test-utils/playwright/utils/helpers/finance";

const route = "/api/finance/accounts";

test401WhenLoggedOut("post", route);

for (const [name, data] of ACCOUNT_BAD_REQUEST_TEST_CASES) {
    test(`rejects creating resources when ${name}`, async ({ request }) => {
        const response = await request.post(route, { data });
        expect(response.status()).toBe(400);
    });
}

test("allows creating new resources with valid values", async ({ request, db }) => {
    const response = await request.post(route, { data: BASE_ACCOUNT });
    const data = response.headers().location;
    expect(response.status()).toBe(201);
    const dbData = await db.financeAccount.select();
    expect(dbData).toHaveLength(1);
    expect(data).toBe(`${route}/${dbData[0]!.id}`);
});

test("ignores any provided id for determining ownership", async ({ request, db }) => {
    await request.post(route, { data: { ...BASE_ACCOUNT, userId: "2222222222222222" } });
    const data = await db.financeAccount.select();
    const user = await db.user.selectByEmail("user@test.com");
    expect(data[0]!.userId).toBe(user!.id);
});
