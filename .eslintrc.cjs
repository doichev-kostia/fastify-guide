/**
 *
 * @type {import('eslint').Linter.Config}
 */
const config= {
	root: true,
	plugins: ['@typescript-eslint'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 6,
		sourceType: 'module',
	},
	env: {
		es6: true,
	},
	rules: {
		'@typescript-eslint/consistent-type-imports': [
			'error',
			{
				prefer: 'type-imports',
				fixStyle: 'inline-type-imports',
			},
		],
	}
};

module.exports = config;
