import type { Page } from "@playwright/test";
import BasePage from "~~/test-utils/playwright/pages/base.page";

const LOCATORS = {
    addListButton: "todo-list-add-button",
};

export default class TodoPage extends BasePage<typeof LOCATORS> {
    constructor(page: Page) {
        super(page, LOCATORS, "/todo");
    }
}
