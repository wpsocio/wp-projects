import { rolldown } from 'rolldown';
import type { Rollup } from 'vite';
import { toPosixRelative } from '../../utils/paths.js';
import { shouldExternalizePackage } from '../externals/index.js';

const STYLE_IMPORTS =
	/\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)(?:$|\?)/;

const EMPTY_MODULE_ID = '\0vwpr:empty';

function normalizeInput(input?: Rollup.InputOption): Array<string> {
	if (typeof input === 'string') {
		return [input];
	}

	return (Array.isArray(input) ? input : Object.values(input ?? {})).filter(
		Boolean,
	);
}

/**
 * Collects externalized dependencies per entry by scanning the module graph
 * with rolldown, using the same predicate as the `externals` plugin.
 */
export async function scanEntries(
	root: string,
	input: Rollup.InputOption | undefined,
	normalize: (name: string) => string,
) {
	const entries = normalizeInput(input);

	if (!entries.length) {
		throw new Error('No entry points found');
	}

	const dependencies: Record<string, Array<string>> = {};

	await Promise.all(
		entries.map(async (entry) => {
			const deps = new Set<string>();

			const bundle = await rolldown({
				cwd: root,
				input: entry,
				logLevel: 'silent',
				plugins: [
					{
						name: 'vwpr:scan-wp-dependencies',
						resolveId(id) {
							if (STYLE_IMPORTS.test(id)) {
								return EMPTY_MODULE_ID;
							}

							if (shouldExternalizePackage(id)) {
								deps.add(normalize(id));
								return { id, external: true };
							}
						},
						load(id) {
							if (id === EMPTY_MODULE_ID) {
								return '';
							}
						},
					},
				],
			});

			// The module graph is only built on generate.
			await bundle.generate();
			await bundle.close();

			dependencies[toPosixRelative(root, entry)] = [...deps];
		}),
	);

	return dependencies;
}
