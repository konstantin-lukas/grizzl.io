import { BASE_TRANSACTION, FULL_TRANSACTION } from "~~/test-utils/constants/finance";
import {
    test401WhenLoggedOut,
    testIdParameter,
    testPatchDeletedPropertyOnSubResourceWithInvalidParentResource,
    testPatchSoftDeletableTrait,
} from "~~/test-utils/playwright/utils/helpers";

const route = (id: string) => `/api/finance/accounts/${id}/transactions`;

testIdParameter("patch", route("2222222222222222"), { deleted: true });
test401WhenLoggedOut("patch", route("2222222222222222"));
testPatchSoftDeletableTrait({
    fixtureProvider: async (db, options) => {
        const [account] = await db.financeAccount.insert(1, options?.userId ? { userId: options.userId } : undefined);
        const [data] = await db.financeTransaction.insert(1, {
            accountId: account.id,
            deletedAt: options?.deleted ? new Date() : null,
        });
        return { data, route: `${route(account.id)}/${data.id}` };
    },
    fixtureName: "financeTransaction",
    fullData: FULL_TRANSACTION,
    baseData: BASE_TRANSACTION,
});
testPatchDeletedPropertyOnSubResourceWithInvalidParentResource(async (db, userId) => {
    const [account1, account2] = await db.financeAccount.insert(2, userId ? { userId } : undefined);
    const [transaction] = await db.financeTransaction.insert(1, { accountId: account1.id });
    return {
        validUrl: `${route(account1.id)}/${transaction.id}`,
        invalidUrl: `${route(account2.id)}/${transaction.id}`,
        unknownUrl: `${route("2222222222222222")}/${transaction.id}`,
    };
});
