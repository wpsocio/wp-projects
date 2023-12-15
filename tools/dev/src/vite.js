// @ts-check
import { v4wp } from '@kucrut/vite-for-wp';
import { wp_scripts } from '@kucrut/vite-for-wp/plugins';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { Plugin as importToCDN } from 'vite-plugin-cdn-import';
import { extractExternalDepsPlugin } from './extract-external-deps-plugin.js';

export { defineConfig };

/**
 *
 * @param {import('@kucrut/vite-for-wp').V4wpOptions} options
 * @returns  {import('vite').UserConfig}
 */
export function createViteConfig(options) {
	return {
		resolve: {
			alias: {
				// react: 'https://cdn.skypack.dev/react@18',
				// 'react-dom': 'https://cdn.skypack.dev/react-dom@18',
			},
		},
		optimizeDeps: {
			include: ['framer-motion'],
		},
		build: {
			assetsDir: 'dist',
		},
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
					},
				}),
			},
			importToCDN({
				/**
				 * Use the fake paths to ensure react imports don't end up in the bundle
				 * framer-motion causes the issue by using namespace imports
				 *
				 * @see https://github.com/vitejs/vite-plugin-react/issues/3
				 */
				modules: [
					{
						name: 'react',
						var: 'React',
						path: 'https://wordpress.org',
					},
					{
						name: 'react-dom',
						var: 'ReactDOM',
						path: 'https://wordpress.org',
					},
				],
			}),

			extractExternalDepsPlugin(),
		],
	};
}
