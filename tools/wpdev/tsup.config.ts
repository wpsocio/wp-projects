import { type Options, defineConfig } from 'tsup';

const commonConfig: Options = {
	clean: true,
	splitting: true,
	dts: true,
	sourcemap: true,
	format: ['cjs'],
	outDir: 'dist/cjs',
};
export default defineConfig([
	{
		entry: ['src/index.ts'],
		...commonConfig,
		name: 'index',
	},
]);
