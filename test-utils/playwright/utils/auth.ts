import { test } from "~~/test-utils/playwright";

export function withoutAuth(tests: () => void) {
    test.describe("", { tag: `@noAuth` }, () => {
        test.use({
            storageState: { cookies: [], origins: [] },
        });
        tests();
    });
}
