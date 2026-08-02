import type { UserConfig } from 'vite';
import { type ViteWpReactOptions, viteWpReact } from './index.js';

export type CreateViteConfigOptions = ViteWpReactOptions;

/**
 * Create Vite config.
 */
export function createViteConfig(
	options: CreateViteConfigOptions = {},
): UserConfig {
	return {
		// Ensure that the asset paths are relative.
		base: './',
		plugins: [
			viteWpReact({
				assetsDir: 'dist',
				...options,
			}),
		],
	};
}
