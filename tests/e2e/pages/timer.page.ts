import BasePage from "@e2e/pages/base.page";
import type { Page } from "@playwright/test";

const LOCATORS = {};

export default class TimerPage extends BasePage<typeof LOCATORS> {
    constructor(page: Page) {
        super(page, LOCATORS, "/timer");
    }
}
