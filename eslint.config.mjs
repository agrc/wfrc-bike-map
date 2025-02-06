import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import prettier from "eslint-plugin-prettier";
import _import from "eslint-plugin-import";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        "dist/**/*",
        "**/.firebase",
        "**/.github",
        "**/.vscode",
        "**/build",
        "**/data",
        "**/forklift",
        "**/maps",
        "**/mockups",
        "**/public",
        "**/scripts",
        "**/node_modules",
        "**/package-lock.json",
    ],
}, ...fixupConfigRules(compat.extends(
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier",
)), {
    plugins: {
        prettier,
        import: fixupPluginRules(_import),
        "jsx-a11y": fixupPluginRules(jsxA11Y),
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        ecmaVersion: "latest",
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },
}];