import {
	BUNDLED_WP_PACKAGES,
	dashToCamelCase,
	NON_WP_PACKAGES,
} from '../../utils/wp-packages.js';

export function shouldExternalizePackage(name: string) {
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
	if (!shouldExternalizePackage(name)) {
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
