import rollupGlobals from 'rollup-plugin-external-globals';
import type { PluginOption } from 'vite';
import viteExternalPlugin from 'vite-plugin-external';
import {
	BUNDLED_WP_PACKAGES,
	NON_WP_PACKAGES,
	dashToCamelCase,
} from '../utils/index.js';

const createExternal =
	// viteExternalPlugin is not typed well
	viteExternalPlugin as unknown as (typeof viteExternalPlugin)['default'];

export function shouldExternalizePakage(name: string) {
	if (BUNDLED_WP_PACKAGES.includes(name)) {
		return false;
	}

	return name in NON_WP_PACKAGES || name.startsWith('@wordpress/');
}

/**
 * Default externalize callback for WordPress packages.
 * This will externalize all WordPress packages to `window.wp.*`
 * and non-WordPress packages to their global variable names.
 *
 * @param name The package name.
 * @returns The externalized variable name.
 */
export function defaultExternalizeCallback(name: string): string {
	if (!shouldExternalizePakage(name)) {
		return '';
	}

	if (name in NON_WP_PACKAGES) {
		return NON_WP_PACKAGES[name];
	}

	if (name.startsWith('@wordpress/')) {
		const variable = dashToCamelCase(name.replace('@wordpress/', ''));
		return `wp.${variable}`;
	}

	return '';
}

/**
 * Updates the vite config to externalize all WordPress packages.
 */
export const externalizeWpPackages = (
	callback = defaultExternalizeCallback,
): PluginOption => {
	return [
		{
			name: 'vwpr:externalize-wp-packages',
			apply: 'build',
			config() {
				return {
					build: {
						rollupOptions: {
							external(source) {
								return shouldExternalizePakage(source);
							},
							plugins: [
								/**
								 * Add the plugin to rollup to ensure react imports don't end up in the bundle
								 * framer-motion causes the issue by using namespace imports
								 *
								 * @see https://github.com/vitejs/vite-plugin-react/issues/3
								 */
								rollupGlobals(callback),
							],
						},
					},
				};
			},
		},
		{
			...createExternal({ externals: callback }),
			apply: 'serve',
		},
	];
};
