import type { Page } from "@playwright/test";
import BasePage from "~~/test-utils/playwright/pages/base.page";

const LOCATORS = {
    // OVERVIEW
    createButton: "poll-overview-create-button",
    viewButtons: "poll-overview-view-button",
    deleteButtons: "poll-overview-delete-button",
};

export default class PollPage extends BasePage<typeof LOCATORS> {
    constructor(page: Page) {
        super(page, LOCATORS, "/poll");
    }
}
