import { defineVitestProject } from "@nuxt/test-utils/config";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        coverage: {
            include: [
                "app/utils/**/*",
                "server/utils/**/*",
                "shared/utils/**/*",
                "app/components/**/*",
                "app/composables/**/*",
            ],
            exclude: ["app/components/timer/**/*"],
            reporter: ["text", "lcov", "json"],
        },
        // https://github.com/nuxt/nuxt/discussions/25973#discussioncomment-11308604
        onConsoleLog: log => {
            return !log.startsWith("<Suspense>") && !log.includes("middleware");
        },
        projects: [
            await defineVitestProject({
                test: {
                    name: "unit",
                    typecheck: {
                        tsconfig: "tests/tsconfig.json",
                    },
                    include: ["tests/unit/**/*.test.ts"],
                    environment: "node",
                },
            }),
            await defineVitestProject({
                test: {
                    name: "components",
                    include: ["tests/nuxt/components/**/*.test.ts"],
                    environment: "nuxt",
                    setupFiles: "../tests/nuxt/setup.ts",
                    environmentOptions: {
                        nuxt: {
                            domEnvironment: "happy-dom",
                        },
                    },
                },
            }),
            await defineVitestProject({
                test: {
                    name: "composables",
                    include: ["tests/nuxt/composables/**/*.test.ts"],
                    environment: "nuxt",
                    setupFiles: "../tests/nuxt/setup.ts",
                    environmentOptions: {
                        nuxt: {
                            domEnvironment: "happy-dom",
                        },
                    },
                },
            }),
        ],
    },
});
