import type { ConfigOptions } from "@nuxt/test-utils/playwright";
import { defineConfig, devices } from "playwright/test";

const apiTestDir = "api/**/*.spec.ts";
export default defineConfig<ConfigOptions>({
    testDir: "./tests/e2e/spec",
    fullyParallel: false,
    maxFailures: process.env.CI ? 1 : undefined,
    forbidOnly: !!process.env.CI,
    retries: 0,
    workers: 1,
    reporter: process.env.CI ? "github" : "line",
    globalSetup: "./tests/e2e/global.setup.ts",
    expect: {
        timeout: 20000,
    },
    timeout: 30000,
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
    },
    projects: [
        {
            name: "API",
            testMatch: apiTestDir,
        },
        {
            name: "Chromium",
            use: {
                ...devices["Desktop Chrome"],
                permissions: ["clipboard-read", "clipboard-write"],
            },
            testIgnore: apiTestDir,
        },
        {
            name: "Firefox",
            use: { ...devices["Desktop Firefox"] },
            testIgnore: apiTestDir,
        },
        {
            name: "Safari",
            use: { ...devices["Desktop Safari"] },
            testIgnore: apiTestDir,
        },
        {
            name: "MobileChrome",
            use: {
                ...devices["Pixel 5"],
                permissions: ["clipboard-read", "clipboard-write"],
            },
            testIgnore: apiTestDir,
        },
        {
            name: "MobileSafari",
            use: { ...devices["iPhone 12"] },
            testIgnore: apiTestDir,
        },
    ],
});
