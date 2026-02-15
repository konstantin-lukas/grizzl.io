import { defineVitestProject } from "@nuxt/test-utils/config";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        coverage: {
            include: [
                "app/utils/**/*",
                "app/components/**/*",
                "app/composables/**/*",
                "shared/utils/**/*",
                "server/utils/**/*",
                "server/**/*.repository.ts",
                "server/**/*.service.ts",
                "server/**/*.controller.ts",
            ],
            exclude: ["app/features/**/timer/**/*"],
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
                    include: ["tests/unit/**/*.test.ts"],
                    environment: "node",
                },
            }),
            await defineVitestProject({
                test: {
                    name: "repositories",
                    include: ["tests/integration/repositories/**/*.test.ts"],
                    environment: "node",
                    maxWorkers: 1,
                    setupFiles: "./test-utils/vitest/setup/database.setup.ts",
                },
            }),
            await defineVitestProject({
                test: {
                    name: "infra",
                    include: ["tests/infra/**/*.test.ts"],
                    environment: "node",
                },
            }),
            await defineVitestProject({
                test: {
                    name: "components",
                    include: ["tests/nuxt/components/**/*.test.ts"],
                    environment: "nuxt",
                    setupFiles: "./test-utils/vitest/setup/nuxt.setup.ts",
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
                    setupFiles: "./test-utils/vitest/setup/nuxt.setup.ts",
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
