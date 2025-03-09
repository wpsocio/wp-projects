import viteReact from '@vitejs/plugin-react';
import type { InputOption } from 'rollup';
import type { Plugin, PluginOption } from 'vite';
import {
	type DevServerOptions,
	type ExtractWpDependenciesOptions,
	type ReactMakePotOptions,
	devServer,
	externalizeWpPackages,
	extractWpDependencies,
	getMakePotReactConfig,
	reactMakePot,
} from './plugins/index.js';

export type ViteWpReactOptions = {
	/**
	 * The entry point to your application. Defaults to `js/main.js`.
	 * @default 'js/main.js'
	 */
	input?: InputOption;

	/**
	 * The directory to write the build to. Defaults to `build`.
	 * @default 'build'
	 */
	outDir?: string;

	/**
	 * The directory to write assets to.
	 */
	assetsDir?: string;
};

export type ViteWpReactConfig = {
	/**
	 * Whether to externalize WordPress packages.
	 * i.e. `@wordpress/*` imports will be removed from the bundle and replaced with `window.wp.*`.
	 */
	externalizeWpPackages?: boolean;

	/**
	 * Whether to extract WordPress dependencies.
	 * If enabled, a `dependencies.json` file will be generated in the `outDir` directory,
	 * containing a list of all WordPress dependencies used in the bundle.
	 */
	extractWpDependencies?: Partial<ExtractWpDependenciesOptions> | boolean;

	/**
	 * Whether to generate a POT file from your React components.
	 */
	makePot?: ReactMakePotOptions | boolean;

	/**
	 * Whether to enable React support.
	 */
	enableReact?: boolean;

	/**
	 * cors.origin value for the dev server.
	 */
	corsOrigin?: DevServerOptions['corsOrigin'];
};

export function viteWpReact(
	{
		input = 'js/main.js',
		outDir = 'build',
		assetsDir,
	}: ViteWpReactOptions = {},
	config: ViteWpReactConfig = {},
): PluginOption {
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

	const plugins: PluginOption = [
		mainPlugin,
		devServer({ corsOrigin: config.corsOrigin }),
	];

	if (config.externalizeWpPackages) {
		plugins.push(externalizeWpPackages());
	}

	if (config.extractWpDependencies) {
		// If `extractWpDependencies` is a boolean, use the default options.
		const extractDepsConfig =
			typeof config.extractWpDependencies === 'boolean'
				? { outDir }
				: {
						outDir,
						...config.extractWpDependencies,
					};

		plugins.push(extractWpDependencies(extractDepsConfig));
	}

	const makePot = config.makePot
		? typeof config.makePot === 'boolean'
			? {}
			: config.makePot
		: undefined;

	if (config.enableReact ?? true) {
		plugins.push(
			viteReact(makePot ? getMakePotReactConfig(makePot) : undefined),
		);
	} else if (makePot) {
		plugins.push(reactMakePot(makePot));
	}

	return plugins;
}

export default viteWpReact;
