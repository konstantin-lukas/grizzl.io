// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
import vuejsA11y from "eslint-plugin-vuejs-accessibility";

const a11yRules = vuejsA11y.configs.recommended.rules;

export default withNuxt([
    {
        plugins: {
            "vuejs-accessibility": vuejsA11y,
        },
        rules: {
            ...a11yRules,
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
        },
    },
]);
