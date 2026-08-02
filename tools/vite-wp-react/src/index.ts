import viteReact from '@vitejs/plugin-react';
import type { Plugin, PluginOption, Rollup } from 'vite';
import { devServer } from './plugins/dev-server/index.js';
import { externals as externalsPlugin } from './plugins/externals/index.js';
import {
	type WpDependenciesOptions,
	wpDependencies as wpDependenciesPlugin,
} from './plugins/wp-dependencies/index.js';

export type { WpDependenciesOptions };

export {
	BUNDLED_WP_PACKAGES,
	NON_WP_PACKAGES,
	PACKAGE_HANDLES,
} from './utils/wp-packages.js';

export type MakePotOptions = {
	output?: string;
	headers?: Record<string, string>;
	functions?: Record<string, Array<string | null>>;
};

export type ViteWpReactOptions = {
	/**
	 * The entry point to your application. Defaults to `js/main.js`.
	 * @default 'js/main.js'
	 */
	input?: Rollup.InputOption;

	/**
	 * The directory to write the build to. Defaults to `build`.
	 * @default 'build'
	 */
	outDir?: string;

	/**
	 * The directory to write assets to.
	 */
	assetsDir?: string;

	/**
	 * Whether to externalize WordPress packages.
	 * i.e. `@wordpress/*` imports will be removed from the bundle and replaced with `window.wp.*`.
	 *
	 * Pass a function to customize the global variable name for a package.
	 * It receives the package name and should return the variable name to use,
	 * or undefined to use the default. It is only called for externalizable
	 * candidates - `@wordpress/*` packages and the known browser globals
	 * (`NON_WP_PACKAGES`), minus the bundled ones (`BUNDLED_WP_PACKAGES`).
	 *
	 * @default true
	 */
	externals?: boolean | ((name: string) => string | undefined);

	/**
	 * Whether to extract WordPress dependencies.
	 * If enabled, a `dependencies.json` file will be generated in the `outDir` directory,
	 * containing a list of all WordPress dependencies used by each entry.
	 *
	 * @default true
	 */
	wpDependencies?: boolean | WpDependenciesOptions;

	/**
	 * Whether to generate a POT file from your React components.
	 *
	 * @default false
	 */
	makePot?: boolean | MakePotOptions;

	/**
	 * cors.origin value for the dev server.
	 */
	corsOrigin?: boolean | Array<string>;
};

export function viteWpReact({
	input = 'js/main.js',
	outDir = 'build',
	assetsDir,
	externals = true,
	wpDependencies = true,
	makePot,
	corsOrigin,
}: ViteWpReactOptions = {}): PluginOption {
	const mainPlugin: Plugin = {
		name: 'vwpr:config',
		enforce: 'pre',
		config() {
			return {
				build: {
					outDir,
					assetsDir,
					manifest: 'manifest.json',
					rollupOptions: { input },
					sourcemap: true,
				},
				css: {
					devSourcemap: true,
				},
			};
		},
	};

	const plugins: PluginOption = [mainPlugin, devServer({ corsOrigin })];

	if (externals) {
		plugins.push(
			externalsPlugin(
				typeof externals === 'function' ? externals : undefined,
			),
		);
	}

	if (wpDependencies) {
		plugins.push(
			wpDependenciesPlugin({
				outDir,
				...(typeof wpDependencies === 'object' ? wpDependencies : {}),
			}),
		);
	}

	const makePotOptions = makePot
		? makePot === true
			? {}
			: makePot
		: undefined;

	plugins.push(
		viteReact(
			makePotOptions && {
				babel: {
					plugins: [['@wordpress/babel-plugin-makepot', makePotOptions]],
				},
			},
		),
	);

	return plugins;
}
