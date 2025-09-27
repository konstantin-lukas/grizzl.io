import type { Page } from "@playwright/test";

import BasePage from "@e2e/page/base.page";

const LOCATORS = {
    installButton: "install-prompt-button",
    menuButton: "menu-button",
    sessionButton: "session-button",
    pollLink: "menu-link-poll",
    timerLink: "menu-link-timer",
    financeLink: "menu-link-finance",
    todoLink: "menu-link-todo",
    themeToggleLight: "theme-toggle-light",
    themeToggleDark: "theme-toggle-dark",
    inertContainer: "inert-container",
    root: "root",
};

export default class HomePage extends BasePage<typeof LOCATORS> {
    constructor(page: Page) {
        super(page, LOCATORS, "/");
    }
}
