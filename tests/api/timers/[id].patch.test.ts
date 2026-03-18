import { BASE_TIMER, FULL_TIMER } from "~~/test-utils/constants/timer";
import { test401WhenLoggedOut, testIdParameter, testSoftDeletableTrait } from "~~/test-utils/playwright/utils/helpers";

const route = "/api/timers";

testIdParameter("patch", route, { deleted: true });
test401WhenLoggedOut("patch", route);
testSoftDeletableTrait({
    fixtureProvider: async (db, options) => {
        const baseData = { deletedAt: options?.deleted ? new Date() : null };
        const [data] = await db.timer.insert(1, options?.userId ? { ...baseData, userId: options.userId } : baseData);
        return { data, route: `${route}/${data.id}` };
    },
    fixtureName: "timer",
    fullData: FULL_TIMER,
    baseData: BASE_TIMER,
});
