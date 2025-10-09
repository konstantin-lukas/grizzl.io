import BasePage from "@e2e/pages/base.page";
import type { Page } from "@playwright/test";

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
    inertElements: "inert-elements",
    root: "root",
};

export default class HomePage extends BasePage<typeof LOCATORS> {
    constructor(page: Page) {
        super(page, LOCATORS, "/");
    }
}
