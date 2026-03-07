import { test } from "~~/test-utils/playwright";
import { NO_AUTH } from "~~/test-utils/playwright/tags";

export function withoutAuth(tests: () => void) {
    test.describe("", { tag: NO_AUTH }, () => {
        test.use({
            storageState: { cookies: [], origins: [] },
        });
        tests();
    });
}
