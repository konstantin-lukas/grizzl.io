import type { Page } from "@playwright/test";
import type { Dialog } from "playwright-core";
import BasePage from "~~/test-utils/playwright/pages/base.page";

const LOCATORS = {
    // OVERVIEW
    addListButton: "todo-list-add-button",
    openListButtons: "todo-open-list-button",

    // LIST MODAL
    modal: "todo-list-modal",
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
}
