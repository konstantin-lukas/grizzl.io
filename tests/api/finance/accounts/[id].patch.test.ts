import { BASE_ACCOUNT, FULL_ACCOUNT } from "~~/test-utils/constants/finance";
import {
    test401WhenLoggedOut,
    testIdParameter,
    testPatchSoftDeletableTrait,
} from "~~/test-utils/playwright/utils/helpers";

const route = "/api/finance/accounts";

testIdParameter("patch", route, { deleted: true });
test401WhenLoggedOut("patch", route);
testPatchSoftDeletableTrait({
    fixtureProvider: async (db, options) => {
        const baseData = { deletedAt: options?.deleted ? new Date() : null };
        const [data] = await db.financeAccount.insert(
            1,
            options?.userId ? { ...baseData, userId: options.userId } : baseData,
        );
        return { data, route: `${route}/${data.id}` };
    },
    fixtureName: "financeAccount",
    fullData: FULL_ACCOUNT,
    baseData: BASE_ACCOUNT,
});
