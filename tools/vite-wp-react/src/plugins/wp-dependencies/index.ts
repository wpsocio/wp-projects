import fs from 'node:fs';
import path from 'node:path';
import type { Plugin, ResolvedConfig, Rollup } from 'vite';
import { getWpScriptHandle } from '../../utils/wp-packages.js';
import { externalShims } from '../externals/index.js';
import { collectFromGraph } from './collect-from-graph.js';
import { scanEntries } from './scan-entries.js';

export type WpDependenciesOptions = {
	/**
	 * The name of the generated file.
	 *
	 * @default 'dependencies.json'
	 */
	fileName?: string;

	/**
	 * Maps a package name to its WordPress script handle.
	 */
	normalize?: (name: string) => string;
};

type WpDependenciesPluginOptions = WpDependenciesOptions & {
	outDir: string;
};

/**
 * Extracts external dependencies into a JSON file.
 *
 * In build, they are derived from the module graph, falling back to an entry
 * scan when nothing was externalized. In dev, there is no module graph, so
 * the entries are always scanned.
 */
export const wpDependencies = ({
	outDir,
	fileName = 'dependencies.json',
	normalize = getWpScriptHandle,
}: WpDependenciesPluginOptions): Plugin => {
	let config: ResolvedConfig;
	let input: Rollup.InputOption | undefined;

	return {
		name: 'vwpr:wp-dependencies',
		configResolved(resolvedConfig) {
			config = resolvedConfig;
		},
		async buildStart(options) {
			input = options.input;

			if (config.command === 'build') {
				return;
			}

			try {
				const dependencies = await scanEntries(
					config.root,
					input,
					normalize,
				);

				fs.mkdirSync(outDir, { recursive: true });
				fs.writeFileSync(
					path.join(outDir, fileName),
					JSON.stringify(dependencies, null, 2),
				);
			} catch (error) {
				this.warn(`Failed to extract dependencies: ${error}`);
			}
		},
		async generateBundle() {
			const dependencies = externalShims.size
				? collectFromGraph(this, config.root, normalize)
				: await scanEntries(config.root, input, normalize);

			this.emitFile({
				type: 'asset',
				fileName,
				source: JSON.stringify(dependencies, null, 2),
			});
		},
	};
};
