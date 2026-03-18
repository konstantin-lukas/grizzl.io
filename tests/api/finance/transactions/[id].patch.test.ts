import { BASE_TRANSACTION, FULL_TRANSACTION } from "~~/test-utils/constants/finance";
import { test401WhenLoggedOut, testIdParameter, testSoftDeletableTrait } from "~~/test-utils/playwright/utils/helpers";

const route = (id: string) => `/api/finance/accounts/${id}/transactions`;

testIdParameter("patch", route("2222222222222222"), { deleted: true });
test401WhenLoggedOut("patch", route("2222222222222222"));
testSoftDeletableTrait({
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
