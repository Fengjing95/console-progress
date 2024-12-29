import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier'

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ files: ['**/*.{js,mjs,cjs,ts}'] },
	{ languageOptions: { globals: globals.browser } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	{
		plugins: {
			prettier: prettier
		},
		rules: {
			'prettier/prettier': 'error',
			'no-console': 'off',
			'no-restricted-globals': 'off',
			'no-restricted-syntax': 'off',
			'vue/multi-word-component-names': 'off',
			'no-multiple-empty-lines': ['warn', { max: 1 }]
		}
	}
]
