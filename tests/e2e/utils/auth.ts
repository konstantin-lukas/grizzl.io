import { test } from "@e2e/fixtures";

export function withoutAuth(tests: () => void) {
    test.describe("", { tag: `@noAuth` }, () => {
        test.use({
            storageState: { cookies: [], origins: [] },
        });
        tests();
    });
}
