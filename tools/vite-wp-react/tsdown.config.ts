import { defineConfig, type UserConfig } from 'tsdown';

const commonConfig: UserConfig = {
	clean: true,
	dts: true,
	sourcemap: true,
	format: ['esm', 'cjs'],
	outDir: 'dist',
	fixedExtension: true,
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
]);
