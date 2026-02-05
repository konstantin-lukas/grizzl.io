import { test } from "@@/playwright/fixtures";

export function withoutAuth(tests: () => void) {
    test.describe("", { tag: `@noAuth` }, () => {
        test.use({
            storageState: { cookies: [], origins: [] },
        });
        tests();
    });
}
