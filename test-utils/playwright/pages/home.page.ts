import type { Page } from "@playwright/test";
import BasePage from "~~/test-utils/playwright/pages/base.page";

const LOCATORS = {
    signInButton: "home-sign-in-button",
    signOutButton: "home-sign-out-button",
    timerHero: "home-hero-card-timer",
    financeHero: "home-hero-card-finance",
    pollHero: "home-hero-card-poll",
    todoHero: "home-hero-card-todo",
};

export default class HomePage extends BasePage<typeof LOCATORS> {
    constructor(page: Page) {
        super(page, LOCATORS, "/");
    }
}
