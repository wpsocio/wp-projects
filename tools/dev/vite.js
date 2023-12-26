// @ts-check
import viteWpReact from '@wpsocio/vite-wp-react';
import { defineConfig } from 'vite';

export { defineConfig };

/**
 * Create Vite config
 *
 * @param {import('./types.js').CreateViteConfigOptions} options
 *
 * @returns {import('vite').UserConfigExport}
 */
export function createViteConfig({ outDir, input, makePot }) {
	return {
		build: {
			assetsDir: 'dist',
		},
		plugins: [
			viteWpReact(
				{ outDir, input },
				{
					extractWpDependencies: {},
					externalizeWpPackages: true,
					enableReact: true,
					makePot,
				},
			),
		],
	};
}
