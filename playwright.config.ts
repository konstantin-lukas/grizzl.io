import { defineConfig, devices } from "playwright/test";

export default defineConfig({
    testDir: "./test/e2e/spec",
    fullyParallel: false,
    forbidOnly: true,
    retries: 0,
    workers: 1,
    reporter: "line",
    globalSetup: "./test/e2e/global.setup.ts",
    expect: {
        timeout: 5000,
    },
    use: {
        trace: "on-all-retries",
        testIdAttribute: "data-test-id",
        baseURL: "http://grizzl.localhost",
        locale: "en-US",
        timezoneId: "Europe/Berlin",
        storageState: "test/e2e/storage.json",
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
