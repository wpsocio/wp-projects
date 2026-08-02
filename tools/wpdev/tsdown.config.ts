import { defineConfig, type UserConfig } from 'tsdown';

const commonConfig: UserConfig = {
	clean: true,
	dts: true,
	sourcemap: true,
	format: ['cjs'],
	outDir: 'dist/cjs',
	fixedExtension: true,
};

export default defineConfig([
	{
		entry: ['src/index.ts'],
		...commonConfig,
		name: 'index',
	},
]);
