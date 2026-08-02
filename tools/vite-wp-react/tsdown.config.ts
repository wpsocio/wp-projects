import { defineConfig, type UserConfig } from 'tsdown';

const commonConfig: UserConfig = {
	clean: true,
	dts: true,
	sourcemap: true,
	format: ['esm', 'cjs'],
	outDir: 'dist',
	fixedExtension: true,
	/*
	 * Pin CJS output to named exports. Entries mixing named and default exports
	 * resolve to this anyway, so it only silences the MIXED_EXPORTS warning.
	 */
	cjsDefault: false,
	/* Keep third party types imported rather than inlined into our .d.ts files. */
	deps: { dts: { neverBundle: true } },
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
