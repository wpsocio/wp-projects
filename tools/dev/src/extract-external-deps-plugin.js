// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { wp_globals } from '@kucrut/vite-for-wp/utils';
import { build as esBuild } from 'esbuild';

export const IMPORTS_TO_IGNORE =
	/\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)(?:$|\?)/;

/**
 * Extract dependencies
 *
 * @param {import('./types.js').ExtractDepsOptions} options
 * @this {import('rollup').PluginContext}
 */
export async function extractExternalDeps({
	externalDeps = [],
	fileName = 'dependencies.json',
	input,
	isProduction = true,
	normalizePath,
	outDir,
	plugins = [],
}) {
	/**
	 * @type {Record<string, string[]>}
	 */
	const dependencies = {};

	/**
	 * @type {Array<string>}
	 */
	const entries = [];

	if (typeof input === 'string') {
		entries.push(input);
	} else if (Array.isArray(input)) {
		entries.push(...input);
	} else if (typeof input === 'object') {
		entries.push(...Object.values(input));
	}

	const validEntries = entries.filter(Boolean);

	if (!validEntries.length) {
		throw new Error('No entry points found');
	}

	const filter = new RegExp(`^(${externalDeps.join('|')})$`);

	try {
		await Promise.all(
			validEntries.map((entry) => {
				dependencies[entry] = [];

				return esBuild({
					entryPoints: [entry],
					outdir: './',
					bundle: true,
					write: false,
					platform: 'browser',
					plugins: [
						{
							name: 'external-deps',
							setup(build) {
								build.onResolve({ filter }, (args) => ({
									path: args.path,
									namespace: 'external-deps',
								}));

								build.onLoad(
									{ filter: /.*/, namespace: 'external-deps' },
									(args) => {
										dependencies[entry].push(
											normalizePath ? normalizePath(args.path) : args.path,
										);
										return {
											contents: 'exports.ok = true;',
											loader: 'js',
										};
									},
								);

								build.onLoad({ filter: IMPORTS_TO_IGNORE }, () => {
									return {
										contents: '',
										loader: 'empty',
									};
								});
							},
						},
						...plugins,
					],
				});
			}),
		);

		const source = JSON.stringify(dependencies);
		// emitFile is not available during dev mode
		isProduction
			? this.emitFile({ type: 'asset', fileName, source })
			: fs.writeFileSync(path.join(outDir, fileName), source);
	} catch (error) {
		console.error('ERROR EXTRACTING DEPENDENCIES', error);
	}
}

/**
 *
 * @returns {import('vite').Plugin}
 */
export const extractExternalDepsPlugin = () => {
	/**
	 * @type {import('vite').ResolvedConfig}
	 */
	let config;

	return {
		name: 'extract-external-deps',
		configResolved(resolvedConfig) {
			config = resolvedConfig;
		},
		/**
		 *
		 * @param {import('rollup').InputOptions} options
		 * @this {import('rollup').PluginContext}
		 */
		buildStart: async function (options) {
			const externals = wp_globals();

			extractExternalDeps.call(this, {
				externalDeps: Object.keys(externals),
				input: options.input,
				isProduction: config.isProduction,
				normalizePath: (path) => path.replace(/^@wordpress\//, 'wp-'),
				outDir: path.resolve(path.join(config.build.outDir)),
			});
		},
	};
};
