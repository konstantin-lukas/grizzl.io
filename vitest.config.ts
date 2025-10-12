import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
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
});
