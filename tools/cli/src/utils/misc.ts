import fs from 'node:fs/promises';
import path from 'node:path';
import fg, { Options } from 'fast-glob';

export type ToUpdate = {
	files: string | Array<string>;
	ignore?: Array<string>;
};

export function globFiles(toUpdate: ToUpdate, options?: Options) {
	return fg.sync(toUpdate.files, {
		ignore: toUpdate.ignore,
		...options,
	});
}

export async function copyDir(
	sourceDir: string,
	destDir: string,
	options?: Partial<Options>,
) {
	const entries = globFiles(
		{
			files: ['**/*'],
			...options,
			ignore: [
				'**/node_modules/**',
				'**/dev-server.json',
				...(options?.ignore || []),
			],
		},
		{ cwd: sourceDir },
	);

	for (const file of entries) {
		const filePath = path.join(sourceDir, file);
		const destPath = path.join(destDir, file);

		if (!(await fs.stat(path.dirname(destPath))).isDirectory()) {
			await fs.mkdir(path.dirname(destPath), { recursive: true });
		}

		await fs.copyFile(filePath, destPath);
	}
}
