import path from 'node:path';
import { build as esBuild } from 'esbuild';
import type { Plugin as EsBuildPlugin } from 'esbuild';
import type { InputOption } from 'rollup';

export const IMPORTS_TO_IGNORE =
	/\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)(?:$|\?)/;

export type ExtractDependenciesOptions = {
	absWorkingDir: string;
	input?: InputOption;
	externalDeps: Array<string>;
	normalizePath?: (path: string) => string;
	plugins?: Array<EsBuildPlugin>;
	onComplete?: (data: string) => void;
};

/**
 * Extract dependencies
 */
export async function extractDependencies({
	absWorkingDir,
	externalDeps = [],
	input,
	normalizePath,
	plugins = [],
	onComplete,
}: ExtractDependenciesOptions) {
	const dependencies: Record<string, Array<string>> = {};
	const entries: Array<string> = [];

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
			validEntries.map((absoluteEntry) => {
				// Make entry relative to working directory
				const entry = path
					.relative(absWorkingDir, absoluteEntry)
					// Normalize the entry to posix style
					.split(path.sep)
					.join(path.posix.sep);

				// Initialize the entry
				dependencies[entry] = [];

				return esBuild({
					absWorkingDir,
					entryPoints: [entry],
					outdir: './',
					bundle: true,
					write: false,
					platform: 'browser',
					plugins: [
						{
							name: 'extract-dependencies',
							setup(build) {
								build.onResolve({ filter }, (args) => ({
									path: args.path,
									namespace: 'extract-dependencies',
								}));
								build.onLoad(
									{ filter: /.*/, namespace: 'extract-dependencies' },
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

		const source = JSON.stringify(dependencies, null, 2);

		onComplete?.(source);
	} catch (error) {
		console.error('ERROR EXTRACTING DEPENDENCIES', error);
	}
}
