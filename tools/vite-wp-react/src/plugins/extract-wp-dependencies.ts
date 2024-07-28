import fs from 'node:fs';
import path from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';
import {
	BUNDLED_WP_PACKAGES,
	NON_WP_PACKAGES,
	PACKAGE_HANDLES,
	type ScanDependenciesOptions,
	scanDependencies,
} from '../utils/index.js';

export type ExtractWpDependenciesOptions = {
	outDir: string;
	fileName?: string;
} & Pick<ScanDependenciesOptions, 'plugins' | 'normalizePath'>;

const dependenciesToScan = new RegExp(
	`^((${Object.keys(NON_WP_PACKAGES).join('|')})|@wordpress/.+)$`,
);

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
				dependenciesToScan,
				excludeDependencies: BUNDLED_WP_PACKAGES,
				input: options.input,
				normalizePath: (path) => {
					if (path in PACKAGE_HANDLES) {
						return PACKAGE_HANDLES[path];
					}

					const _path = path.replace(/^@wordpress\//, 'wp-');

					return _path;
				},
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
