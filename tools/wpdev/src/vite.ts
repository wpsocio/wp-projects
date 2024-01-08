import viteWpReact from '@wpsocio/vite-wp-react';
import { defineConfig } from 'vite';
import { CreateViteConfigOptions } from './types.js';

export { defineConfig };

/**
 * Create Vite config
 */
export function createViteConfig({
	outDir,
	input,
	makePot,
}: CreateViteConfigOptions) {
	return {
		plugins: [
			viteWpReact(
				{ outDir, input, assetsDir: 'dist' },
				{
					extractWpDependencies: true,
					externalizeWpPackages: true,
					enableReact: true,
					makePot,
				},
			),
		],
	};
}
