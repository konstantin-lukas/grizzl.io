import BasePage from "@e2e/pages/base.page";
import type { Page } from "@playwright/test";

export default class HomePage extends BasePage<Record<string, string>> {
    constructor(page: Page) {
        super(page, {}, "/");
    }
}
