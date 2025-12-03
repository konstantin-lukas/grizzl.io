import type { ConfigOptions } from "@nuxt/test-utils/playwright";
import { defineConfig, devices } from "playwright/test";

const apiTestDir = "api/**/*.spec.ts";
export default defineConfig<ConfigOptions>({
    testDir: "./tests/e2e/spec",
    fullyParallel: false,
    forbidOnly: true,
    retries: 0,
    workers: 1,
    reporter: "html",
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
            name: "Web - Chromium",
            use: {
                ...devices["Desktop Chrome"],
                permissions: ["clipboard-read", "clipboard-write"],
            },
            testIgnore: apiTestDir,
        },
        {
            name: "Web - Firefox",
            use: { ...devices["Desktop Firefox"] },
            testIgnore: apiTestDir,
        },
        {
            name: "Web - Webkit",
            use: { ...devices["Desktop Safari"] },
            testIgnore: apiTestDir,
        },
        {
            name: "Web - Mobile Chrome",
            use: {
                ...devices["Pixel 5"],
                permissions: ["clipboard-read", "clipboard-write"],
            },
            testIgnore: apiTestDir,
        },
        {
            name: "Web - Mobile Safari",
            use: { ...devices["iPhone 12"] },
            testIgnore: apiTestDir,
        },
    ],
});
