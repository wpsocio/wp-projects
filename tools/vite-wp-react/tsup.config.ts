import { type Options, defineConfig } from 'tsup';

const commonConfig: Options = {
	clean: true,
	splitting: true,
	dts: true,
	sourcemap: true,
	format: ['esm', 'cjs'],
	outDir: 'dist',
};
export default defineConfig([
	{
		entry: ['src/index.ts'],
		...commonConfig,
		name: 'index',
	},
	{
		entry: ['src/config.ts'],
		...commonConfig,
		name: 'config',
	},
	{
		entry: ['src/utils/index.ts'],
		...commonConfig,
		outDir: 'dist/utils',
	},
	{
		entry: ['src/plugins/index.ts'],
		...commonConfig,
		outDir: 'dist/plugins',
	},
]);
