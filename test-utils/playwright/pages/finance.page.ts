import type { Page } from "@playwright/test";
import BasePage from "~~/test-utils/playwright/pages/base.page";

const LOCATORS = {
    // UPSERT FORM
    titleInput: "finance-upsert-title-input",
    currencySelect: "finance-upsert-currency-select",
    currencyOptions: "finance-upsert-currency-select-option",

    // MISCELLANEOUS
    accountMenu: "finance-account-control-menu",
    accountMenuOption: "finance-account-menu-option",
};

export default class TimerPage extends BasePage<typeof LOCATORS> {
    constructor(page: Page) {
        super(page, LOCATORS, "/finance");
    }

    async completeAccountUpsertForm({ title = "New Account", currency = "Euro" } = {}) {
        await this.fill("titleInput", title);
        await this.click("currencySelect");
        await this.page.keyboard.type(currency);
        await this.click("currencyOptions", { nth: 0 });
        await this.click("upsertSubmit");
    }
}
