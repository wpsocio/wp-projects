import fs from 'node:fs';
import path from 'node:path';
import { ToUpdate, globFiles } from './misc.js';

export type UpdateChangelogConfig = {
	changelogPath: string;
	readmeTxt: ToUpdate;
};

export async function updateChangelog(
	project: string,
	version: string,
	config: UpdateChangelogConfig,
) {
	const changelogPath = path.join(project, config.changelogPath);

	if (!fs.existsSync(changelogPath)) {
		throw new Error(`Changelog not found at "${changelogPath}"`);
	}

	const changelogContents = fs.readFileSync(changelogPath, 'utf8');
	// Match anything between "## Unreleased" and the previous release tag like "## [0.0.0]"
	const changelogRegex = /(?<=##\sUnreleased)[\s\S]+?(?=##\s?\[\d+\.\d+\.\d+)/i;
	const changelogChanges = changelogContents.match(changelogRegex)?.[0].trim();

	if (!changelogChanges) {
		throw new Error('Cannot find changelog changes');
	}

	// Match the one character after "== Changelog ==" to add the notes after it
	const readmeTxtRegex = /== Changelog ==([\s\S])/i;

	const readmeTxtChanges = '\n\n= {version} =\n{changes}\n';

	const readmeTxtEntries = globFiles(config.readmeTxt, { cwd: project });

	for (const file of readmeTxtEntries) {
		const filePath = path.join(project, file);
		const fileContents = fs.readFileSync(filePath, 'utf8');

		const contents = fileContents.replace(readmeTxtRegex, (match, $1) => {
			const changes = changelogChanges
				// remove headings like Enhancements, Bug fixes
				.replace(/(^|\n)(##.+)/g, '')
				// replace empty lines
				.replace(/\n[\s\t]*\n/g, '\n')
				// cleanup
				.trim();

			const replace = readmeTxtChanges
				.replace('{version}', version)
				.replace('{changes}', changes);

			return match.replace($1, replace);
		});

		fs.writeFileSync(filePath, contents);
	}
}
