import rollupGlobals from 'rollup-plugin-external-globals';
import type { PluginOption } from 'vite';
import viteExternalPlugin from 'vite-plugin-external';
import {
	BUNDLED_WP_PACKAGES,
	NON_WP_PACKAGES,
	WP_EXTERNAL_PACKAGES,
	dashToCamelCase,
} from '../utils/index.js';

const viteExternal =
	// viteExternalPlugin is not typed well
	viteExternalPlugin as unknown as (typeof viteExternalPlugin)['default'];

function shouldExternalizePakage(name: string) {
	if (BUNDLED_WP_PACKAGES.includes(name)) {
		return false;
	}

	const isWpPackage = name.startsWith('@wordpress/');

	const isNonWpPackage = name in NON_WP_PACKAGES;

	return isWpPackage || isNonWpPackage;
}

/**
 * Updates the vite config to externalize all WordPress packages.
 */
export const externalizeWpPackages = (): PluginOption => {
	return [
		{
			name: 'vwpr:externalize-wp-packages',
			config(config, { command }) {
				// We need to run this only for the build command
				if (command !== 'build') {
					return {};
				}
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
								rollupGlobals((name) => {
									if (!shouldExternalizePakage(name)) {
										return '';
									}

									if (name in NON_WP_PACKAGES) {
										return NON_WP_PACKAGES[name];
									}

									if (name.startsWith('@wordpress/')) {
										const variable = dashToCamelCase(
											name.replace('@wordpress/', ''),
										);
										return `wp.${variable}`;
									}

									return '';
								}),
							],
						},
					},
				};
			},
		},
		/**
		 * We need this plugin only during development
		 * To ensure that module aliases are created for external packages
		 *
		 * Change the externals list to dynamic if the below issue is resolved
		 * @see https://github.com/fengxinming/vite-plugins/issues/44
		 */
		viteExternal({
			development: {
				externals: WP_EXTERNAL_PACKAGES,
			},
		}),
	];
};
