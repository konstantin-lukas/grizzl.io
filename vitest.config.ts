import { defineVitestProject } from "@nuxt/test-utils/config";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        projects: [
            {
                test: {
                    name: "unit",
                    typecheck: {
                        tsconfig: "tests/tsconfig.json",
                    },
                    alias: {
                        "@@": __dirname,
                        "@unit": path.resolve(__dirname, "./tests/unit"),
                    },
                    include: ["tests/unit/**/*.test.ts"],
                    environment: "node",
                },
            },
            await defineVitestProject({
                test: {
                    name: "nuxt",
                    include: ["tests/nuxt/**/*.{test,spec}.ts"],
                    environment: "nuxt",
                    env: {
                        DB_PASSWORD: "nuts",
                    },
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
