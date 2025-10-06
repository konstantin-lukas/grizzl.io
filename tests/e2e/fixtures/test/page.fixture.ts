import type { Page } from "@playwright/test";

import type BasePage from "@e2e/pages/base.page";

type Constructor<T> = new (page: Page) => T;
export default function constructPageObject<T extends BasePage<never>>(Class: Constructor<T>) {
    return async ({ page }: { page: Page }, waitForUse: (value: T) => Promise<void>) => {
        const pageObject = new Class(page);
        await waitForUse(pageObject);
    };
}
