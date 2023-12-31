import fs from 'node:fs';
import path from 'node:path';
import archiver from 'archiver';
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

		if (!fs.existsSync(path.dirname(destPath))) {
			fs.mkdirSync(path.dirname(destPath), { recursive: true });
		}

		fs.copyFileSync(filePath, destPath);
	}
}

export async function zipDir(sourceDir: string, outPath: string) {
	const archive = archiver('zip', { zlib: { level: 9 } });
	const stream = fs.createWriteStream(outPath);

	return await new Promise((resolve, reject) => {
		archive
			.directory(sourceDir, path.basename(sourceDir))
			.on('error', (err) => reject(err))
			.pipe(stream);

		stream.on('close', () =>
			resolve(`Zip file created successfully at ${outPath}`),
		);
		archive.finalize();
	});
}
