import { defineVitestProject } from "@nuxt/test-utils/config";
import { defineConfig } from "vitest/config";

const plugins = [
    {
        name: "patch-conditions",
        enforce: "post",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        configEnvironment(name: string, config: any) {
            if (name === "ssr") {
                config.resolve!.conditions = config.resolve!.conditions!.filter((c: string) => c !== "import");
            }
        },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
] as any;

export default defineConfig({
    test: {
        reporters: process.env.GITHUB_ACTIONS ? ["dot", "github-actions"] : ["dot"],
        //silent: true,
        coverage: {
            include: [
                "app/**/utils/**/*",
                "app/**/components/**/*",
                "app/**/composables/**/*",
                "shared/**/utils/**/*",
                "server/**/utils/**/*",
                "server/**/*.repository.ts",
                "server/**/*.service.ts",
                "server/**/*.controller.ts",
            ],
            exclude: ["app/timer/**/*", "app/finance/**/*", "app/core/components/data/CookieBanner.vue"],
            reporter: ["text", "lcov", "json"],
        },
        projects: [
            await defineVitestProject({
                test: {
                    name: "unit",
                    include: ["tests/unit/**/*.test.ts"],
                    environment: "node",
                },
                plugins,
            }),
            await defineVitestProject({
                test: {
                    name: "integration",
                    include: ["tests/integration/**/*.test.ts"],
                    environment: "node",
                    maxWorkers: 1,
                    setupFiles: "./test-utils/vitest/setup/database.setup.ts",
                },
                plugins,
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
