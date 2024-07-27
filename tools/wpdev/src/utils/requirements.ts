import fs from 'node:fs';
import path from 'node:path';
import { type TaskTarget, globFiles } from './misc.js';

export type Requirements = {
	requiresPHP: string;
	requiresAtLeast: string;
	testedUpTo: string;
};

export type RequirementsConfig = {
	requirements: Requirements;
	target: TaskTarget;
};

/**
 * Updates the requirements in README.txt and the main file of the project.
 *
 * For plugins, it's the plugin main file
 * For themes, it's the style.css file
 */
export async function updateRequirements(
	cwd: string,
	{ requirements, target }: RequirementsConfig,
) {
	const strings: Requirements = {
		requiresAtLeast: 'Requires at least',
		requiresPHP: 'Requires PHP',
		testedUpTo: 'Tested up to',
	};

	const entries = globFiles(target, { cwd });

	for (const file of entries) {
		const filePath = path.join(cwd, file);
		let fileContents = fs.readFileSync(filePath, 'utf8');

		for (const [dataKey, version] of Object.entries(requirements)) {
			const stringToSearchFor = strings[dataKey as keyof Requirements];

			const regex = new RegExp(
				`(?<=${stringToSearchFor}[^0-9]*?)\\d+\\.\\d+(?:\\.\\d+)?`,
				'i',
			);

			fileContents = fileContents.replace(regex, `${version}`);
		}

		fs.writeFileSync(filePath, fileContents);
	}
}
