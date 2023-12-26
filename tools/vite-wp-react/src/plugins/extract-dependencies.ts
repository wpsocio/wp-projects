import fs from 'node:fs';
import path from 'node:path';
import { Plugin, ResolvedConfig } from 'vite';
import {
	ExtractDependenciesOptions,
	WP_EXTERNAL_PACKAGES,
	extractDependencies,
} from '../utils/index.js';

export type ExtractDependenciesPluginOptions = {
	outDir: string;
	fileName?: string;
} & Pick<ExtractDependenciesOptions, 'plugins' | 'normalizePath'>;

/**
 * Extract external dependencies from the bundle.
 */
export const extractDependenciesPlugin = ({
	outDir,
	fileName = 'dependencies.json',
	...otherOptions
}: ExtractDependenciesPluginOptions): Plugin => {
	let config: ResolvedConfig;
	return {
		name: 'vwpr:extract-dependencies',
		configResolved(resolvedConfig) {
			config = resolvedConfig;
		},
		async buildStart(options) {
			extractDependencies({
				absWorkingDir: config.root,
				externalDeps: Object.keys(WP_EXTERNAL_PACKAGES),
				input: options.input,
				normalizePath: (path) => path.replace(/^@wordpress\//, 'wp-'),
				onComplete: (source) => {
					// this.emitFile is available only in build mode
					config.command === 'build'
						? this.emitFile({ type: 'asset', fileName, source })
						: fs.writeFileSync(path.join(outDir, fileName), source);
				},
				...otherOptions,
			});
		},
	};
};
