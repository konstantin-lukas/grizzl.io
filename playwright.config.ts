import type { ConfigOptions } from "@nuxt/test-utils/playwright";
import { defineConfig, devices } from "playwright/test";

const apiTestDir = "api/**/*.test.ts";
export default defineConfig<ConfigOptions>({
    testDir: "./tests/e2e/spec",
    fullyParallel: false,
    maxFailures: process.env.CI ? 1 : undefined,
    forbidOnly: !!process.env.CI,
    retries: 0,
    workers: 1,
    reporter: process.env.CI ? [["github"], ["html"]] : "line",
    globalSetup: "./tests/e2e/global.setup.ts",
    expect: {
        timeout: 20000,
        toHaveScreenshot: {
            animations: "disabled",
        },
    },
    timeout: 30000,
    snapshotDir: "./tests/e2e/snapshots",
    use: {
        trace: "retain-on-failure",
        testIdAttribute: "data-test-id",
        baseURL: "http://grizzl.localhost",
        locale: "en-US",
        timezoneId: "Europe/Berlin",
        storageState: "tests/e2e/storage.json",
        nuxt: {
            host: "http://grizzl.localhost",
        },
        contextOptions: {
            reducedMotion: "reduce",
        },
    },
    projects: [
        {
            name: "api",
            testMatch: apiTestDir,
        },
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"],
                permissions: ["clipboard-read", "clipboard-write"],
            },
            testIgnore: apiTestDir,
        },
        {
            name: "firefox",
            use: { ...devices["Desktop Firefox"] },
            testIgnore: apiTestDir,
        },
        {
            name: "safari",
            use: { ...devices["Desktop Safari"] },
            testIgnore: apiTestDir,
        },
        {
            name: "mobile_chrome",
            use: {
                ...devices["Pixel 5"],
                permissions: ["clipboard-read", "clipboard-write"],
            },
            testIgnore: apiTestDir,
        },
        {
            name: "mobile_safari",
            use: { ...devices["iPhone 12"] },
            testIgnore: apiTestDir,
        },
    ],
});
