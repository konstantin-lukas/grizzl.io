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
        storageState: "tests/e2e/storage.json",
    },
    projects: [
        { name: "setup", testMatch: "auth.setup.ts" },
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"],
                permissions: ["clipboard-read", "clipboard-write"],
            },
            dependencies: ["setup"],
        },
        {
            name: "firefox",
            use: { ...devices["Desktop Firefox"] },
            dependencies: ["setup"],
        },
        {
            name: "webkit",
            use: { ...devices["Desktop Safari"] },
            dependencies: ["setup"],
        },
        {
            name: "Mobile Chrome",
            use: {
                ...devices["Pixel 5"],
                permissions: ["clipboard-read", "clipboard-write"],
            },
            dependencies: ["setup"],
        },
        {
            name: "Mobile Safari",
            use: { ...devices["iPhone 12"] },
            dependencies: ["setup"],
        },
    ],
});
