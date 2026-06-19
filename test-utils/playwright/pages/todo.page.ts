import type { Page } from "@playwright/test";
import type { Dialog } from "playwright-core";
import BasePage from "~~/test-utils/playwright/pages/base.page";

const LOCATORS = {
    // OVERVIEW
    addListButton: "todo-list-add-button",
    openListButtons: "todo-open-list-button",
    listCardTitles: "list-card-title",
    categoryIcon: "category-icon",

    // LIST MODAL
    modal: "todo-list-modal",
    listTitle: "list-title",
    completedTexts: "todo-completed-item-text",
    optionsButton: "todo-list-options-button",
    closeButton: "todo-close-modal-button",
    notSyncing: "todo-list-is-not-syncing",
    syncing: "todo-list-is-syncing",
    addItem: "todo-add-item-button",
    dragHandles: "todo-item-drag-handle",
    checkboxes: "todo-item-checkbox",
    textInputs: "todo-item-text-input",
    datePickers: "date-picker-button",
    deleteButtons: "todo-item-delete-button",
    completedList: "todo-completed-items-list",
    uncompletedList: "todo-uncompleted-items-list",
    accordion: "todo-completed-items-accordion",
    clearDate: "clear-date-button",

    // LIST OPTIONS
    titleInput: "list-options-title-input",
    presetTitles: "list-options-preset-title",
    presetTitleInput: "list-options-preset-title-input",
    presetSaveButton: "list-options-preset-save-button",
    presetApplyButtons: "list-options-preset-apply-button",
    presetApplyConfirmButton: "list-options-preset-apply-confirm-button",
    presetApplyCancelButton: "list-options-preset-apply-cancel-button",
    presetDeleteButtons: "list-options-preset-delete-button",
    listDeleteButton: "list-options-delete-button",
    categorySelect: "category-icon-select-button",
    categoryOptions: "category-icon-select-option",
};

export default class TodoPage extends BasePage<typeof LOCATORS> {
    public dialog?: Dialog;

    constructor(page: Page) {
        page.on("dialog", async dialog => {
            this.dialog = dialog;
            await dialog.dismiss();
        });

        super(page, LOCATORS, "/todo");
    }

    async waitForSync() {
        await this.expect("syncing")
            .toBeAttached()
            .catch(() => null);
        await this.expect("notSyncing").toBeAttached();
    }

    async syncAndReload() {
        await this.expect("syncing")
            .toBeAttached()
            .catch(() => null);
        await this.expect("notSyncing").toBeAttached();
        await this.page.reload();
        await this.expect("notSyncing").toBeAttached();
    }

    async applyPreset(n = 0) {
        await this.click("openListButtons");
        await this.click("optionsButton");
        await this.click("presetApplyButtons", { nth: n });
        await this.click("presetApplyConfirmButton");
        await this.page.keyboard.press("Escape");
    }
}
