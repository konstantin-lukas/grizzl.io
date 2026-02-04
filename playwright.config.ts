import type { ConfigOptions } from "@nuxt/test-utils/playwright";
import { defineConfig, devices } from "playwright/test";

const projects = [
    {
        name: "api",
        testDir: "./tests/api",
    },
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
        name: "safari",
        use: { ...devices["Desktop Safari"] },
    },
    {
        name: "mobile_chrome",
        use: {
            ...devices["Pixel 5"],
            permissions: ["clipboard-read", "clipboard-write"],
        },
    },
    {
        name: "mobile_safari",
        use: { ...devices["iPhone 12"] },
    },
];

if (!process.env.CI) {
    projects.push({
        name: "seed",
        testDir: "./seed",
        testMatch: "**/*.seed.ts",
    } as never);
}

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
            maxDiffPixelRatio: process.env.CI ? 0 : 0.3,
            threshold: 0,
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
    projects,
});
