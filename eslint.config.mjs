import { fixupConfigRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import { globalIgnores } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

const config = [
    ...fixupConfigRules(
        compat.extends(
            "eslint:recommended",
            "next/core-web-vitals",
            "next/typescript",
            "plugin:import/recommended",
            "plugin:jsx-a11y/recommended",
            "plugin:@typescript-eslint/strict",
            "plugin:@typescript-eslint/stylistic",
            "prettier",
        ),
    ),
    {
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: "./tsconfig.json",
                tsconfigRootDir: __dirname,
                sourceType: "module",
            },
        },
        rules: {
            "import/first": "error",
            "import/newline-after-import": "error",
            "import/no-duplicates": "error",
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/consistent-type-exports": "error",
            "@typescript-eslint/consistent-type-definitions": "error",
            "@typescript-eslint/consistent-type-assertions": "error",
            "@typescript-eslint/no-non-null-assertion": "off",
            "array-callback-return": "error",
            "default-param-last": "error",
            "eqeqeq": "error",
            "no-array-constructor": "error",
            "no-inner-declarations": "error",
            "no-promise-executor-return": "error",
            "no-self-compare": "error",
            "no-template-curly-in-string": "error",
            "no-unmodified-loop-condition": "error",
            "no-unreachable-loop": "error",
            "no-use-before-define": "error",
            "no-useless-assignment": "error",
            "no-else-return": "error",
            "no-eval": "error",
            "no-implied-eval": "error",
            "no-loop-func": "error",
            "no-multi-assign": "error",
            "no-nested-ternary": "error",
            "no-new-func": "error",
            "no-new-object": "error",
            "no-param-reassign": "error",
            "no-prototype-builtins": "error",
            "no-restricted-globals": "error",
            "no-unneeded-ternary": "error",
            "no-useless-escape": "error",
            "no-var": "error",
            "object-shorthand": "error",
            "one-var": ["error", "never"],
            "prefer-arrow-callback": "error",
            "prefer-destructuring": "error",
            "prefer-exponentiation-operator": "error",
            "prefer-object-spread": "error",
            "prefer-rest-params": "error",
            "prefer-spread": "error",
            "prefer-template": "error",
            "require-atomic-updates": "error",
            "wrap-iife": "error",
            "yoda": "error",
            "react/self-closing-comp": "error",
            "react/jsx-curly-brace-presence": "error",
        },
    },
    globalIgnores([".next/*", "node_modules/*", "*.mjs", "./next-env.d.ts"]),
];

export default config;
