import viteReact from '@vitejs/plugin-react';
import { InputOption } from 'rollup';
import { Plugin, PluginOption } from 'vite';
import {
	ExtractWpDependenciesOptions,
	ReactMakePotOptions,
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
	extractWpDependencies?: Partial<ExtractWpDependenciesOptions>;

	/**
	 * Whether to generate a POT file from your React components.
	 */
	makePot?: ReactMakePotOptions;

	/**
	 * Whether to enable React support.
	 */
	enableReact?: boolean;
};

export default function viteWpReact(
	{ input = 'js/main.js', outDir = 'build' }: ViteWpReactOptions = {},
	config: ViteWpReactConfig = {},
): PluginOption[] {
	const mainPlugin: Plugin = {
		name: 'vwpr:config',
		enforce: 'pre',
		config() {
			return {
				build: {
					outDir,
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

	const plugins: PluginOption[] = [mainPlugin, devServer()];

	if (config.externalizeWpPackages) {
		plugins.push(externalizeWpPackages());
	}

	if (config.extractWpDependencies) {
		plugins.push(
			extractWpDependencies({
				outDir,
				...config.extractWpDependencies,
			}),
		);
	}

	if (config.enableReact ?? true) {
		plugins.push(
			viteReact(
				config.makePot ? getMakePotReactConfig(config.makePot) : undefined,
			),
		);
	} else if (config.makePot) {
		plugins.push(reactMakePot(config.makePot));
	}

	return plugins;
}
