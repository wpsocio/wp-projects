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
 * @param {import('@kucrut/vite-for-wp').V4wpOptions} options
 * @param {import('vite').BuildOptions} [buildOptions]
 *
 * @returns {import('vite').UserConfig}
 */
export function createViteConfig(options, buildOptions) {
	return {
		plugins: [
			react(),
			v4wp({ outDir: 'src/assets/build', ...options }),
			wp_scripts(),
			{
				name: 'wpsocio:override-config',
				config: () => ({
					build: {
						// emptyOutDir: false,
						// minify: false,
						// cssCodeSplit: false,
						assetsDir: 'dist',
						// ensure that manifest.json is not in ".vite/" folder
						manifest: 'manifest.json',
						...buildOptions,
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
		],
	};
}
