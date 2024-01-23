import fs from 'node:fs';
import { z } from 'zod';
import { UpdateChangelogOptions } from './schema.js';

export const ChangesetJsonSchema = z.object({
	changesets: z.array(
		z.object({
			summary: z.string().optional().default(''),
			id: z.string(),
		}),
	),
	releases: z.array(
		z.object({
			name: z.string(),
			type: z.string().optional(),
			changesets: z.array(z.string()),
		}),
	),
});

export function readChangesetJson(changesetJsonFile: string) {
	if (!changesetJsonFile || !fs.existsSync(changesetJsonFile)) {
		throw new Error('Please provide a valid changeset JSON file.');
	}
	const json = JSON.parse(fs.readFileSync(changesetJsonFile, 'utf8'));

	return ChangesetJsonSchema.parse(json);
}

type UpdateChangelogConfig = UpdateChangelogOptions & {
	changesetJsonFile: string;
	packageName: string;
	version: string;
};

export function updateChangelog({
	changesetJsonFile,
	readmeTxtFile,
	packageName,
	version,
}: UpdateChangelogConfig) {
	const data = readChangesetJson(changesetJsonFile);

	const changesetsMap = new Map(
		data.changesets.map(({ id, summary }) => [id, summary]),
	);

	const changes = [];

	for (const { name, changesets } of data.releases) {
		if (!changesets.length || name !== packageName) {
			continue;
		}
		for (const changeset of changesets) {
			const summary = changesetsMap.get(changeset);

			if (!summary) {
				console.warn(
					`Could not find changeset summary for changeset: "${changeset}"`,
				);
				continue;
			}

			changes.push(`- ${summary}`);
		}
	}

	let readmeTxt = fs.readFileSync(readmeTxtFile, 'utf8');

	const versionStr = `= ${version} =`;

	if (!changes.length) {
		changes.push('- Maintenance release.');
	}

	const changesStr = changes.join('\n');

	readmeTxt = readmeTxt.replace(
		/== Changelog ==\n.*?\[See full changelog\]/s,
		`== Changelog ==\n\n${versionStr}\n${changesStr}\n\n[See full changelog]`,
	);

	fs.writeFileSync(readmeTxtFile, readmeTxt);
}
