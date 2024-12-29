import typescript from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'

export default {
	input: './src/index.ts',
	plugins: [
		typescript({
			rollupCommonJSResolveHack: false,
			clean: true
		}),
		resolve()
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
