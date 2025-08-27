import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import unusedImports from "eslint-plugin-unused-imports";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
	globalIgnores(["dist"]),
	{
		files: ["**/*.{js,jsx,ts,tsx}"],
		plugins: {
			"unused-imports": unusedImports,
		},
		extends: [
			js.configs.recommended,
			reactHooks.configs["recommended-latest"],
			reactRefresh.configs.vite,
		],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			parserOptions: {
				ecmaVersion: "latest",
				ecmaFeatures: { jsx: true },
				sourceType: "module",
			},
		},
		rules: {
			// 🚫 Turn off the base rule — handled by plugin instead
			"no-unused-vars": "off",

			// ✅ Remove unused imports completely
			"unused-imports/no-unused-imports": "error",

			// ✅ But allow unused variables prefixed with "_"
			"unused-imports/no-unused-vars": [
				"error",
				{
					vars: "all",
					varsIgnorePattern: "^_",
					args: "after-used",
					argsIgnorePattern: "^_",
				},
			],
			"react-refresh/only-export-components": "warn",
		},
	},
]);
