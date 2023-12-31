import fs from 'node:fs';
import path from 'node:path';
import cssnano from 'cssnano';
import postcss from 'postcss';
import { ToUpdate, globFiles } from './misc.js';

export async function processStyles(project: string, toUpdate: ToUpdate) {
	const entries = globFiles(toUpdate, { cwd: project });

	for (const file of entries) {
		const filePath = path.join(project, file);
		const fileContents = fs.readFileSync(filePath, 'utf8');

		const destPath = path.format({
			...path.parse(filePath),
			base: '',
			ext: '.min.css',
		});

		const result = await postcss([cssnano]).process(fileContents, {
			from: filePath,
			to: destPath,
		});

		fs.writeFileSync(destPath, result.css);
	}
}
