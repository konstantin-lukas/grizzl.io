import type { Page } from "@playwright/test";
import BasePage from "~~/test-utils/playwright/pages/base.page";

const LOCATORS = {
    // OVERVIEW
    createButton: "poll-overview-create-button",
    viewButtons: "poll-overview-view-button",
    deleteButtons: "poll-overview-delete-button",

    // CREATE FORM
    titleInput: "poll-create-form-title-input",
    choiceInputs: "poll-create-form-choice-input",
    choiceDeleteButtons: "poll-create-form-choice-delete-button",
    clearDateTimeButton: "poll-create-form-clear-datetime-button",
    addChoiceButton: "poll-create-form-add-choice-input-button",

    // VOTING
    voteButton: "submit-vote-button",
    toggleUiButton: "toggle-ui-button",
    choices: "poll-voting-choice",
    clipboardButton: "copy-to-clipboard-button",
};

export default class PollPage extends BasePage<typeof LOCATORS> {
    constructor(page: Page) {
        super(page, LOCATORS, "/poll");
    }
}
