import type { Locator, Page } from "@playwright/test";
import { expect } from "~~/test-utils/playwright";

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
    undeleteButton: "undo-soft-delete-button",
    goBack: "go-back-button",
    menu: "menu",
    root: "root",
    drawer: "drawer",
    slideover: "slideover",
};

export default abstract class BasePage<T extends Record<string, string>> {
    readonly page;
    readonly locators;
    readonly url;
    console: string[] = [];

    protected constructor(page: Page, locators: T, url: string) {
        this.page = page;
        this.locators = Object.fromEntries(
            Object.entries({ ...BASE_LOCATORS, ...locators }).map(([key, value]) => [key, page.getByTestId(value)]),
        ) as Record<keyof T | keyof typeof BASE_LOCATORS, Locator>;
        this.url = url;
        this.page.on("console", msg => {
            this.console.push(msg.text());
        });
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

            const css = `*, *::before, *::after {
              transition: none !important;
              animation: none !important;
              animation-duration: 0s !important;
              animation-delay: 0s !important;
              scroll-behavior: auto !important;
            }`;
            const style = document.createElement("style");
            style.appendChild(document.createTextNode(css));
            document.documentElement.appendChild(style);
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

    async analyzeHydration() {
        const keywords = ["Hydration", "hydration", "Mismatch", "mismatch"];
        for (const keyword of keywords) {
            for (const log of this.console) {
                expect(log).not.toContain(keyword);
            }
        }
    }

    expect(): ReturnType<typeof expect<Page>>;
    expect(
        what: keyof T | keyof typeof BASE_LOCATORS,
        options?: { filter?: Parameters<Locator["filter"]>[0]; nth?: number },
    ): ReturnType<typeof expect<(typeof this.locators)[keyof T | keyof typeof BASE_LOCATORS]>>;
    expect(
        what?: keyof T | keyof typeof BASE_LOCATORS,
        options?: { filter?: Parameters<Locator["filter"]>[0]; nth?: number },
    ) {
        if (!what) return expect(this.page);
        if (!options?.filter) {
            if (typeof options?.nth === "number") {
                return expect(this.locators[what].nth(options.nth));
            }
            return expect(this.locators[what]);
        }
        if (typeof options?.nth === "number") {
            return expect(this.locators[what].nth(options.nth).filter(options.filter));
        }
        return expect(this.locators[what].filter(options.filter));
    }

    async click(what: keyof T | keyof typeof BASE_LOCATORS, options: { nth?: number } = {}) {
        if (typeof options.nth === "number") return this.locators[what].nth(options.nth).click();
        return this.locators[what].click();
    }

    async fill(
        what: keyof T | keyof typeof BASE_LOCATORS,
        value: string,
        options?: Parameters<Locator["fill"]>[1] & { nth?: number },
    ) {
        if (typeof options?.nth === "number") return this.locators[what].nth(options.nth).fill(value, options);
        return this.locators[what].fill(value, options);
    }

    async focus(what: keyof T | keyof typeof BASE_LOCATORS, options: { nth?: number } = {}) {
        if (typeof options.nth === "number") return this.locators[what].nth(options.nth).focus();
        return this.locators[what].focus();
    }

    async swReady() {
        return this.page.evaluate(() => {
            return Promise.race([
                navigator.serviceWorker.ready,
                new Promise<null>(resolve => {
                    setTimeout(() => resolve(null), 5000);
                }),
            ]);
        });
    }

    async toggleTheme(options?: { openMenu?: boolean; closeMenu?: boolean }) {
        const { openMenu = true, closeMenu = true } = { ...options };

        if (openMenu) await this.click("menuButton");
        await this.click("themeToggle");
        await this.page.click("body", { position: { x: 0, y: 0 } });
        if (closeMenu) {
            await this.click("menuButton");
            await this.page.keyboard.press("Escape");
            await this.page.click("body", { position: { x: 0, y: 0 } });
        }
    }

    async expectIntegrity(options?: {
        ariaSnapshotName?: string;
        ariaSnapshotTarget?: keyof T | keyof typeof BASE_LOCATORS;
        skipThemeToggle?: boolean;
    }) {
        const { ariaSnapshotName, ariaSnapshotTarget, skipThemeToggle = false } = { ...options };
        await this.expect(ariaSnapshotTarget ?? "root").toMatchAriaSnapshot({ name: ariaSnapshotName });
        await this.expect().toBeAccessible();
        await this.analyzeHydration();
        await this.expect().toHaveScreenshot();
        if (skipThemeToggle) return;
        await this.toggleTheme();
        await this.expect().toHaveScreenshot();
        await this.toggleTheme();
    }
}
