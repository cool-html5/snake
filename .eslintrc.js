module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['react', 'react-hooks', '@typescript-eslint', 'only-error'],
	extends: ['prettier', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended'],
	settings: {
		react: {
			pragma: 'React',
			version: 'detect'
		}
	},
	rules: {
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/member-delimiter-style': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		"@typescript-eslint/no-non-null-assertion": "off",
		'react/display-name': 'off',
		'react-hooks/rules-of-hooks': 'error',
		// 'react-hooks/exhaustive-deps': 'warn',
		'react/prop-types': 'off',
		'no-restricted-imports': ['error', {patterns: ['@a-tmt/*/*', '@a-tmt/main*']}],
		'react/react-in-jsx-scope': 'off'
	}
}
