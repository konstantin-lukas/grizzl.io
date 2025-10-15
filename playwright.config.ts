import type { ConfigOptions } from "@nuxt/test-utils/playwright";
import { defineConfig, devices } from "playwright/test";

export default defineConfig<ConfigOptions>({
    testDir: "./tests/e2e/spec",
    fullyParallel: false,
    forbidOnly: true,
    retries: 0,
    workers: 1,
    reporter: "html",
    // globalSetup: "./tests/e2e/global.setup.ts",
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
    },
    projects: [
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"],
                permissions: ["clipboard-read", "clipboard-write"],
            },
        },
        {
            name: "firefox",
            use: { ...devices["Desktop Firefox"] },
        },
        {
            name: "webkit",
            use: { ...devices["Desktop Safari"] },
        },
        {
            name: "Mobile Chrome",
            use: {
                ...devices["Pixel 5"],
                permissions: ["clipboard-read", "clipboard-write"],
            },
        },
        {
            name: "Mobile Safari",
            use: { ...devices["iPhone 12"] },
        },
    ],
});
