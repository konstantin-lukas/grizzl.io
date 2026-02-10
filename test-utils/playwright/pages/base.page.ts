import { AxeBuilder } from "@axe-core/playwright";
import type { Locator, Page } from "@playwright/test";
import config from "~~/playwright.config";
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

type LocatorKey<T extends Record<string, string>> = keyof T | keyof typeof BASE_LOCATORS;

export default abstract class BasePage<T extends Record<string, string>> {
    readonly page;
    readonly locators;
    readonly url;
    private console: string[] = [];
    private pageErrors: Error[] = [];

    protected constructor(page: Page, locators: T, url: string) {
        this.page = page;
        this.locators = Object.fromEntries(
            Object.entries({ ...BASE_LOCATORS, ...locators }).map(([key, value]) => [key, page.getByTestId(value)]),
        ) as Record<LocatorKey<T>, Locator>;
        this.url = url;
        this.page.on("console", msg => {
            this.console.push(msg.text());
        });
        this.page.on("pageerror", error => {
            this.pageErrors.push(error);
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

    private toHydrate() {
        const keywords = ["Hydration", "hydration", "Mismatch", "mismatch"];
        for (const keyword of keywords) {
            for (const log of this.console) {
                expect(log).not.toContain(keyword);
            }
        }
    }

    private toHaveNoErrors() {
        expect(this.pageErrors).toHaveLength(0);
    }

    private async toMatchAriaSnapshot(target: Locator, options: { name: string }) {
        const name = options.name.endsWith(".aria.yml") ? options.name : `${options.name}.aria.yml`;
        await expect(target).toMatchAriaSnapshot({ name });
    }

    private async toHaveScreenshot(target: Locator | Page, options: { name: string; blur?: boolean }) {
        const { blur = true } = options;
        const name = options.name.endsWith(".png") ? options.name : `${options.name}.png`;
        const fullPage = target === this.page;

        if (fullPage) {
            await this.page.evaluate(() => {
                window.scrollTo(0, 0);
            });
        }

        if (blur) {
            await this.page.click("body", { position: { x: 0, y: 0 } });
        }

        if (name) return expect(target).toHaveScreenshot(name, { fullPage });
        return expect(target).toHaveScreenshot({ fullPage });
    }

    private async toBeAccessible() {
        const timeout = config.expect?.timeout ?? 5000;
        const axe = new AxeBuilder({ page: this.page })
            .exclude("#nuxt-devtools-container")
            .exclude("[aria-hidden='true']")
            .exclude("[data-hidden='true']");
        const start = Date.now();
        while (true) {
            const results = await axe.analyze();
            if (results.violations.length === 0 || Date.now() - start > timeout) {
                const message = results.violations.map(v => JSON.stringify(v)).join("\n\n");
                expect(results.violations, { message }).toEqual([]);
                break;
            }
            await new Promise(resolve => {
                setTimeout(resolve, 50);
            });
        }
    }

    private async toBeValid(
        options:
            | { name: string; skipThemeToggle?: boolean }
            | { screenshotName: string; ariaName: string; skipThemeToggle?: boolean },
        target?: Locator | Page,
    ) {
        const usesNameShortcut = (value: object): value is { name: string; skipThemeToggle?: boolean } => {
            return "name" in value;
        };
        const isShortcut = usesNameShortcut(options);
        const screenshotName = isShortcut ? options.name : options.screenshotName;
        const ariaName = isShortcut ? options.name : options.ariaName;
        const { skipThemeToggle = false } = options;
        await this.toMatchAriaSnapshot(target && target !== this.page ? (target as Locator) : this.locators.root, {
            name: ariaName!,
        });
        await this.toBeAccessible();
        await this.toHaveScreenshot(target ?? this.page, { name: screenshotName! });
        this.toHydrate();
        this.toHaveNoErrors();
        if (skipThemeToggle) return;
        await this.toggleTheme();
        await this.toHaveScreenshot(target ?? this.page, { name: `${screenshotName}-darkmode` });
        await this.toggleTheme();
    }

    expect(): Omit<ReturnType<typeof expect<Page>>, "toHaveScreenshot"> & {
        toHydrate: typeof BasePage.prototype.toHydrate;
        toHaveNoErrors: typeof BasePage.prototype.toHaveNoErrors;
        toBeAccessible: typeof BasePage.prototype.toBeAccessible;
        toBeValid: (options: Parameters<typeof BasePage.prototype.toBeValid>[0]) => Promise<void>;
        toHaveScreenshot: (options: Parameters<typeof BasePage.prototype.toHaveScreenshot>[1]) => Promise<void>;
    };
    expect(
        what: LocatorKey<T>,
        options?: { filter?: Parameters<Locator["filter"]>[0]; nth?: number },
    ): Omit<
        ReturnType<typeof expect<(typeof this.locators)[LocatorKey<T>]>>,
        "toMatchAriaSnapshot" | "toHaveScreenshot"
    > & {
        toBeValid: (options: Parameters<typeof BasePage.prototype.toBeValid>[0]) => Promise<void>;
        toHaveScreenshot: (options: Parameters<typeof BasePage.prototype.toHaveScreenshot>[1]) => Promise<void>;
        toMatchAriaSnapshot: (options: Parameters<typeof BasePage.prototype.toMatchAriaSnapshot>[1]) => Promise<void>;
    };
    expect(what?: LocatorKey<T>, options?: { filter?: Parameters<Locator["filter"]>[0]; nth?: number }) {
        const target = what ? this.locators[what] : this.page;

        const isPage = (t: unknown): t is Page => t === this.page;
        const isTargetPage = isPage(target);

        const {
            // @ts-expect-error Destructuring used to discard overridden methods
            toMatchAriaSnapshot: _aria,
            toHaveScreenshot: _screen,
            ...expectObject
        } = (() => {
            if (isTargetPage) {
                return {
                    ...expect(target),
                    toHydrate: () => this.toHydrate(),
                    toHaveNoErrors: () => this.toHaveNoErrors(),
                    toBeAccessible: () => this.toBeAccessible(),
                };
            }
            if (!options?.filter) {
                if (typeof options?.nth === "number") {
                    return expect(target.nth(options.nth));
                }
                return expect(target);
            }
            if (typeof options?.nth === "number") {
                return expect(target.nth(options.nth).filter(options.filter));
            }
            return expect(target.filter(options.filter));
        })();

        return {
            ...expectObject,
            toHaveScreenshot: (options: Parameters<typeof this.toHaveScreenshot>[1]) =>
                this.toHaveScreenshot(target, options),
            toBeValid: (options: Parameters<typeof this.toBeValid>[0]) => this.toBeValid(options, target),
            ...(!isTargetPage && {
                toMatchAriaSnapshot: (options: Parameters<typeof this.toMatchAriaSnapshot>[1]) =>
                    this.toMatchAriaSnapshot(target, options),
            }),
        };
    }

    async click(what: LocatorKey<T>, options: { nth?: number } = {}) {
        if (typeof options.nth === "number") return this.locators[what].nth(options.nth).click();
        return this.locators[what].click();
    }

    async fill(what: LocatorKey<T>, value: string, options?: Parameters<Locator["fill"]>[1] & { nth?: number }) {
        if (typeof options?.nth === "number") return this.locators[what].nth(options.nth).fill(value, options);
        return this.locators[what].fill(value, options);
    }

    async focus(what: LocatorKey<T>, options: { nth?: number } = {}) {
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
}
