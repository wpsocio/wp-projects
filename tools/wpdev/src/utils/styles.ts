import fs from 'node:fs';
import path from 'node:path';
import cssnano from 'cssnano';
import postcss from 'postcss';
import { TaskTarget, globFiles } from './misc.js';

export async function minifyStyles(cwd: string, target: TaskTarget) {
	const entries = globFiles(target, { cwd });

	for (const file of entries) {
		const filePath = path.join(cwd, file);
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
