import { BASE_ACCOUNT, FULL_ACCOUNT } from "~~/test-utils/constants/finance";
import { BASE_TIMER, FULL_TIMER } from "~~/test-utils/constants/timer";
import {
    ACCOUNT_BAD_REQUEST_TEST_CASES,
    ACCOUNT_BAD_TITLE_TEST_CASES,
} from "~~/test-utils/playwright/utils/helpers/finance";
import { TIMER_BAD_REQUEST_TEST_CASES, buildTimers } from "~~/test-utils/playwright/utils/helpers/timer";

export const COMMON_TEST_CASES = [
    {
        route: "/api/timers",
        fixture: "timer",
        baseData: BASE_TIMER,
        fullData: FULL_TIMER,
        badPutRequestTestCases: TIMER_BAD_REQUEST_TEST_CASES,
        badPostRequestTestCases: TIMER_BAD_REQUEST_TEST_CASES,
        insertFunction: buildTimers,
        defaultCollectionSortBy: "createdAt",
        defaultCollectionSortOrder: "desc",
        expectedPostResult: {
            ...BASE_TIMER,
            intervals: undefined,
        },
        expectedPutChanges: {
            ...BASE_TIMER,
            intervals: undefined,
        },
    },
    {
        route: "/api/finance/accounts",
        fixture: "financeAccount",
        baseData: BASE_ACCOUNT,
        fullData: FULL_ACCOUNT,
        badPutRequestTestCases: ACCOUNT_BAD_TITLE_TEST_CASES,
        badPostRequestTestCases: ACCOUNT_BAD_REQUEST_TEST_CASES,
        insertFunction: null,
        defaultCollectionSortBy: "createdAt",
        defaultCollectionSortOrder: "desc",
        expectedPostResult: {
            ...BASE_ACCOUNT,
            balance: 0,
        },
        expectedPutChanges: { title: BASE_ACCOUNT.title },
    },
] as const;
