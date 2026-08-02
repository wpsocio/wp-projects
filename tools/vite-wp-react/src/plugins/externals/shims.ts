import fs from 'node:fs';
import path from 'node:path';

export const SHIM_DIR = 'node_modules/.vite_external';

/**
 * Shim file path → package name, used by the `wpDependencies` plugin.
 *
 * @internal
 */
export const externalShims = new Map<string, string>();

export const nameToShimFile = (name: string) =>
	`${name.replace(/\//g, '_')}.js`;

export const shimFileToName = (file: string) =>
	path.basename(file, '.js').replace(/_/g, '/');

/**
 * Prepares the shim directory and returns a writer for individual shims.
 */
export function createShimWriter(root: string) {
	const shimDir = path.resolve(root, SHIM_DIR);

	fs.mkdirSync(shimDir, { recursive: true });

	// Mark the CJS shims as such, since the project package.json says "module".
	fs.writeFileSync(path.join(shimDir, 'package.json'), '{"type":"commonjs"}\n');

	const writeShim = (name: string, globalName: string) => {
		const file = path.join(shimDir, nameToShimFile(name));

		if (!externalShims.has(file)) {
			fs.writeFileSync(file, `module.exports = ${globalName};\n`);
			externalShims.set(file, name);
		}

		return file;
	};

	return { shimDir, writeShim };
}
