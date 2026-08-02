import path from 'node:path';

/**
 * Makes a file path relative to the root, in posix style.
 */
export const toPosixRelative = (root: string, file: string) =>
	path
		.relative(root, path.resolve(root, file))
		.split(path.sep)
		.join(path.posix.sep);
