import typescript from 'rollup-plugin-typescript2'

export default {
	input: './src/index.ts',
	plugins: [
		typescript({
			rollupCommonJSResolveHack: false,
			clean: true
		})
	],
	output: [
		{
			dir: 'lib/commonjs',
			format: 'cjs',
			exports: 'named'
		},
		{
			dir: 'lib/esm',
			format: 'es',
			exports: 'named'
		}
	]
}
