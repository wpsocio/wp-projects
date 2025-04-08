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
 * @returns The externalized variable name or undefined.
 */
export function defaultExternalizeCallback(name: string) {
	if (!shouldExternalizePakage(name)) {
		return;
	}

	if (name in NON_WP_PACKAGES) {
		return NON_WP_PACKAGES[name];
	}

	if (name.startsWith('@wordpress/')) {
		const variable = dashToCamelCase(name.replace('@wordpress/', ''));
		return `wp.${variable}`;
	}
}

/**
 * Updates the vite config to externalize all WordPress packages.
 */
export const externalizeWpPackages = (
	callback = defaultExternalizeCallback,
): PluginOption => {
	return [createExternal({ interop: 'auto', externals: callback })];
};
