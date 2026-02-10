import type { ConfigOptions } from "@nuxt/test-utils/playwright";
import { defineConfig, devices } from "playwright/test";

const projects = [
    {
        name: "api",
        testDir: "./tests/integration/api",
    },
    {
        name: "chromium",
        testDir: "./tests/e2e",
        use: {
            ...devices["Desktop Chrome"],
            permissions: ["clipboard-read", "clipboard-write"],
        },
    },
    {
        name: "firefox",
        testDir: "./tests/e2e",
        use: { ...devices["Desktop Firefox"] },
    },
    {
        name: "safari",
        testDir: "./tests/e2e",
        use: { ...devices["Desktop Safari"] },
    },
    {
        name: "mobile_chrome",
        testDir: "./tests/e2e",
        use: {
            ...devices["Pixel 5"],
            permissions: ["clipboard-read", "clipboard-write"],
        },
    },
    {
        name: "mobile_safari",
        testDir: "./tests/e2e",
        use: { ...devices["iPhone 12"] },
    },
];

if (!process.env.CI) {
    projects.push({
        name: "seed",
        testDir: "./test-utils/seed",
        testMatch: "**/*.seed.ts",
    } as never);
}

export default defineConfig<ConfigOptions>({
    testDir: "./tests",
    testMatch: "**/*.test.ts",
    fullyParallel: false,
    maxFailures: process.env.CI ? 1 : undefined,
    forbidOnly: !!process.env.CI,
    retries: 0,
    workers: 1,
    reporter: process.env.CI ? [["github"], ["html"]] : "line",
    globalSetup: "./test-utils/playwright/global.setup.ts",
    expect: {
        timeout: 20000,
        toHaveScreenshot: {
            maxDiffPixelRatio: process.env.SKIP_SCREENSHOTS === "true" ? 1 : 0,
            threshold: 0,
            animations: "disabled",
        },
    },
    timeout: 30000,
    snapshotDir: "./test-utils/playwright/snapshots",
    use: {
        trace: "retain-on-failure",
        testIdAttribute: "data-test-id",
        baseURL: "http://grizzl.localhost",
        locale: "en-US",
        timezoneId: "Europe/Berlin",
        storageState: "./test-utils/playwright/storage.json",
        nuxt: {
            host: "http://grizzl.localhost",
        },
        contextOptions: {
            reducedMotion: "reduce",
        },
    },
    projects,
});
