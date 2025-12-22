import config from "@@/playwright.config";
import { AxeBuilder } from "@axe-core/playwright";
import { expect } from "@e2e/fixtures";
import type { Locator, Page } from "@playwright/test";

type _GotoOptions = NonNullable<Parameters<Page["goto"]>[1]>;
export interface GotoOptions extends Omit<_GotoOptions, "waitUntil"> {
    waitUntil?: "hydration" | "route" | _GotoOptions["waitUntil"];
}

const BASE_LOCATORS = {
    installButton: "install-prompt-button",
    menuButton: "menu-button",
    sessionButton: "session-button",
    pollLink: "menu-link-poll",
    timerLink: "menu-link-timer",
    financeLink: "menu-link-finance",
    todoLink: "menu-link-todo",
    themeToggle: "theme-toggle",
    lightModeIcon: "icon-light-mode",
    darkModeIcon: "icon-dark-mode",
    inertElements: "inert-elements",
    emptyButton: "empty-create-button",
    root: "root",
};

export default abstract class BasePage<T extends Record<string, string>> {
    readonly page;
    readonly locators;
    readonly url;
    protected constructor(page: Page, locators: T, url: string) {
        this.page = page;
        this.locators = Object.fromEntries(
            Object.entries({ ...BASE_LOCATORS, ...locators }).map(([key, value]) => [key, page.getByTestId(value)]),
        ) as Record<keyof T | keyof typeof BASE_LOCATORS, Locator>;
        this.url = url;
    }

    async goto(options: GotoOptions = {}) {
        const { waitUntil = "hydration", ...vanillaOptions } = options;
        const isVanillaWaitUntil = waitUntil !== "hydration" && waitUntil !== "route";
        const result = await this.page.goto(this.url, isVanillaWaitUntil ? vanillaOptions : options);
        if (waitUntil === "hydration") {
            await this.page.waitForFunction(() => window.useNuxtApp?.().isHydrating === false);
        } else if (waitUntil === "route") {
            await this.page.waitForFunction(route => window.useNuxtApp?.()._route.fullPath === route, this.url);
        }
        await this.page.evaluate(() => {
            const el = document.getElementById("nuxt-devtools-container");
            if (el) el.remove();
        });
        return result;
    }

    async all(key: keyof typeof this.locators) {
        const locator = this.locators[key] as Locator;
        await expect(locator).toHaveCountGreaterThan(0);
        return await locator.all();
    }

    async forEach(key: keyof typeof this.locators, callback: (locator: Locator, index: number) => Promise<void>) {
        const all = await this.all(key);
        for (const [index, locator] of all.entries()) {
            await callback(locator, index);
        }
    }

    async analyzeA11y() {
        const timeout = config.expect?.timeout ?? 5000;
        const axe = new AxeBuilder({ page: this.page })
            .exclude("#nuxt-devtools-container")
            .exclude("[aria-hidden]")
            .exclude("[data-hidden]");
        const start = Date.now();
        while (true) {
            const results = await axe.analyze();
            if (results.violations.length === 0 || Date.now() - start > timeout) {
                expect(results.violations).toEqual([]);
                break;
            }
            await new Promise(resolve => {
                setTimeout(resolve, 50);
            });
        }
    }

    expect(): ReturnType<typeof expect<Page>>;
    expect(
        what: keyof T | keyof typeof BASE_LOCATORS,
        filter?: Parameters<Locator["filter"]>[0],
    ): ReturnType<typeof expect<(typeof this.locators)[keyof T | keyof typeof BASE_LOCATORS]>>;
    expect(what?: keyof T | keyof typeof BASE_LOCATORS, filter?: Parameters<Locator["filter"]>[0]) {
        if (!what) return expect(this.page);
        if (!filter) return expect(this.locators[what]);
        return expect(this.locators[what].filter(filter));
    }

    async click(what: keyof T | keyof typeof BASE_LOCATORS) {
        return this.locators[what].click();
    }

    async fill(what: keyof T | keyof typeof BASE_LOCATORS, value: string, options?: Parameters<Locator["fill"]>[1]) {
        return this.locators[what].fill(value, options);
    }
}
