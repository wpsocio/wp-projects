import { V4wpOptions, v4wp } from '@kucrut/vite-for-wp';
import { wp_scripts } from '@kucrut/vite-for-wp/plugins';
import react from '@vitejs/plugin-react';
import { UserConfig, defineConfig } from 'vite';
import { extractExternalDepsPlugin } from './extract-external-deps-plugin.js';

export { defineConfig };

export function createViteConfig(options: V4wpOptions): UserConfig {
	return {
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
						rollupOptions: {
							output: {
								/**
								 * Ensure that external globals work correctly
								 *
								 * @see https://github.com/vitejs/vite-plugin-react/issues/3
								 */
								format: 'iife',
							},
						},
					},
				}),
			},
			extractExternalDepsPlugin(),
		],
	};
}
