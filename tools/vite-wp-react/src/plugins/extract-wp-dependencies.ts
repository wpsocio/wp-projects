import fs from 'node:fs';
import path from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';
import {
	type ScanDependenciesOptions,
	WP_EXTERNAL_PACKAGES,
	scanDependencies,
} from '../utils/index.js';

export type ExtractWpDependenciesOptions = {
	outDir: string;
	fileName?: string;
} & Pick<ScanDependenciesOptions, 'plugins' | 'normalizePath'>;

/**
 * Extract external dependencies from the bundle.
 */
export const extractWpDependencies = ({
	outDir,
	fileName = 'dependencies.json',
	...otherOptions
}: ExtractWpDependenciesOptions): Plugin => {
	let config: ResolvedConfig;
	return {
		name: 'vwpr:extract-dependencies',
		configResolved(resolvedConfig) {
			config = resolvedConfig;
		},
		async buildStart(options) {
			scanDependencies({
				absWorkingDir: config.root,
				dependenciesToScan: Object.keys(WP_EXTERNAL_PACKAGES),
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
