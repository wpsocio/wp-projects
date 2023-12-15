// @ts-check
import { v4wp } from '@kucrut/vite-for-wp';
import { wp_scripts } from '@kucrut/vite-for-wp/plugins';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { Plugin as importToCDN, autoComplete } from 'vite-plugin-cdn-import';
import { extractExternalDepsPlugin } from './extract-external-deps-plugin.js';

export { defineConfig };

/**
 *
 * @param {import('@kucrut/vite-for-wp').V4wpOptions} options
 * @returns  {import('vite').UserConfig}
 */
export function createViteConfig(options) {
	return {
		plugins: [
			react(),
			v4wp(options),
			wp_scripts(),
			{
				name: 'override-config',
				config: () => ({
					build: {
						// ensure that manifest.json is not in ".vite/" folder
						manifest: 'manifest.json',
						assetsDir: 'dist',
					},
				}),
			},
			importToCDN({
				/**
				 * Use the fake CDN imports to ensure react imports don't end up in the bundle
				 * framer-motion causes the issue by using namespace imports
				 *
				 * @see https://github.com/vitejs/vite-plugin-react/issues/3
				 */
				modules: [autoComplete('react'), autoComplete('react-dom')],
			}),
			extractExternalDepsPlugin(),
		],
	};
}
