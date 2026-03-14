import type { Linter } from "eslint";
import tseslint from 'typescript-eslint';
import obsidianmd from "eslint-plugin-obsidianmd";
import globals from "globals";
import { globalIgnores } from "eslint/config";

const recommendedRules = (obsidianmd.configs?.recommended ?? {}) as Linter.RulesRecord;

export default tseslint.config(
	{
		files: ["**/*.{ts,tsx,mts,cts,js,mjs,cjs}"],
		languageOptions: {
			parser: tseslint.parser,
			globals: {
				...globals.browser,
			},
			parserOptions: {
				projectService: {
					allowDefaultProject: [
						'eslint.config.js',
						'manifest.json',
						'test/server.ts',
						'vite.config.mts'
					]
				},
				tsconfigRootDir: import.meta.dirname
			},
		},
		plugins: {
			obsidianmd,
		},
		rules: {
			...recommendedRules,
		},
	},
	globalIgnores([
		"node_modules",
		".yalc",
		"*.json",
		"**/*.json",
		"dist",
		"esbuild.config.mjs",
		"eslint.config.js",
		"version-bump.mjs",
		"versions.json",
		"main.js",
	]),
);
