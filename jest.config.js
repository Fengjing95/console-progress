const esModules = ['.*\\.mjs$', 'ansi-escapes'].join('|')

/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
	testEnvironment: 'node',
	transform: {
		'^.+.tsx?$': ['ts-jest', {}]
	},
	transformIgnorePatterns: [
		// '<rootDir>/node_modules/.pnpm/(?!(chalk)@)',
		`node_modules/(?!.pnpm|${esModules})`
	],
	collectCoverage: true,
	coverageDirectory: 'coverage',
	coveragePathIgnorePatterns: ['\\\\node_modules\\\\'],
	coverageProvider: 'babel'
}
