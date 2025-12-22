import BasePage from "@e2e/pages/base.page";
import type { Page } from "@playwright/test";

const LOCATORS = {
    titleInput: "timer-upsert-title-input",
    voiceSelect: "timer-upsert-voice-select",
    voiceOptions: "timer-upsert-voice-select-option",
    voicePreviewButton: "timer-upsert-voice-preview-button",
    voicePreviewInput: "timer-upsert-voice-preview-input",
    submitButton: "timer-upsert-submit-button",
    listItemTitle: "timer-list-item-title",
    listItemLength: "timer-list-item-length",
    listItemPlayButtons: "timer-list-item-play-button",
    listItemEditButtons: "timer-list-item-edit-button",
    listItemDeleteButtons: "timer-list-item-delete-button",
    formErrors: "timer-upsert-form-errors-alert",
    createButton: "timer-create-button",
};

export default class TimerPage extends BasePage<typeof LOCATORS> {
    constructor(page: Page) {
        super(page, LOCATORS, "/timer");
    }

    async createTimer({ title }: { title: string }) {
        await this.fill("titleInput", title);
        await this.click("submitButton");
    }
}
