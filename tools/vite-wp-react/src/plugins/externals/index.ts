import path from 'node:path';
import type { Alias, Plugin } from 'vite';
import {
	BUNDLED_WP_PACKAGES,
	NON_WP_PACKAGES,
} from '../../utils/wp-packages.js';
import { defaultExternalizeCallback } from './defaults.js';
import { createShimWriter, shimFileToName } from './shims.js';

export * from './defaults.js';
export { externalShims } from './shims.js';

const escapeRegExp = (value: string) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Externalizes WordPress packages by aliasing their imports to CJS shims that
 * read the package off its global. An alias makes both the build and the dev
 * dependency optimizer pick the shims up, with proper CJS interop.
 */
export const externals = (
	callback = defaultExternalizeCallback,
): Plugin => {
	let shims: ReturnType<typeof createShimWriter>;

	return {
		name: 'vwpr:externals',
		enforce: 'pre',
		config(config) {
			shims = createShimWriter(config.root || process.cwd());

			const alias: Array<Alias> = [];

			// Known packages get their shims upfront.
			for (const name of Object.keys(NON_WP_PACKAGES)) {
				const globalName = callback(name) ?? defaultExternalizeCallback(name);

				if (globalName) {
					alias.push({
						find: new RegExp(`^${escapeRegExp(name)}$`),
						replacement: shims.writeShim(name, globalName),
					});
				}
			}

			const bundled = BUNDLED_WP_PACKAGES.map((name) =>
				escapeRegExp(name.replace('@wordpress/', '')),
			).join('|');

			// WordPress packages get their shims on demand, in resolveId.
			alias.push({
				find: new RegExp(`^@wordpress\\/(?!(?:${bundled})$)([^/]+)$`),
				replacement: path.join(shims.shimDir, '@wordpress_$1.js'),
			});

			return { resolve: { alias } };
		},
		resolveId(source) {
			if (source.startsWith(shims.shimDir)) {
				const name = shimFileToName(source);
				const globalName = callback(name) ?? defaultExternalizeCallback(name);

				if (globalName) {
					shims.writeShim(name, globalName);
				}
			}

			return null;
		},
	};
};
