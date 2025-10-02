import type { Page } from "@playwright/test";

import type { ExtendedGotoOptions } from "@e2e/type/test";

export async function goto(page: Page, url: Parameters<Page["goto"]>[0], options?: ExtendedGotoOptions) {
    const waitUntil = options?.waitUntil;
    const response = await page.goto(url, {
        ...options,
        waitUntil: options && waitUntil === "hydration" ? "commit" : undefined,
    });
    if (waitUntil === "hydration") {
        await page.waitForFunction(() => (window as unknown as { __NEXT_HYDRATED__?: boolean }).__NEXT_HYDRATED__);
    }
    return response;
}
