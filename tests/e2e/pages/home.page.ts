import BasePage from "@@/tests/e2e/pages/base.page";
import type { Page } from "@playwright/test";

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
