// @ts-check
import { v4wp } from '@kucrut/vite-for-wp';
import { wp_scripts } from '@kucrut/vite-for-wp/plugins';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { Plugin as importToCDN } from 'vite-plugin-cdn-import';
import { extractExternalDepsPlugin } from './extract-external-deps-plugin.js';

export { defineConfig };

/**
 * Create Vite config
 *
 * @param {import('./types.js').CreateViteConfigOptions} options
 *
 * @returns {import('vite').UserConfigExport}
 */
export function createViteConfig({ outDir, input, buildOptions, makePot }) {
	return function config({ command }) {
		/**
		 * @type {import('@vitejs/plugin-react').BabelOptions | undefined}
		 */
		let babel;

		// Add makepot plugin if command is build and makePot is defined
		if (command === 'build' && makePot) {
			babel = {
				plugins: [['@wordpress/babel-plugin-makepot', makePot]],
			};
		}

		return {
			plugins: [
				react({ babel }),
				v4wp({ outDir, input }),
				wp_scripts(),
				importToCDN({
					/**
					 * Use the fake CDN imports to ensure react imports don't end up in the bundle
					 * framer-motion causes the issue by using namespace imports
					 *
					 * @see https://github.com/vitejs/vite-plugin-react/issues/3
					 */
					modules: [
						{
							name: 'react',
							var: 'React',
							path: 'https://wpsocio.com',
						},
						{
							name: 'react-dom',
							var: 'ReactDOM',
							path: 'https://wpsocio.com',
						},
					],
				}),
				extractExternalDepsPlugin(),
				{
					name: 'wpsocio:override-config',
					config: () => ({
						build: {
							assetsDir: 'dist',
							// ensure that manifest.json is not in ".vite/" folder
							manifest: 'manifest.json',
							...buildOptions,
						},
					}),
				},
			],
		};
	};
}
