import fs from 'node:fs';
import { z } from 'zod';
import type { UpdateChangelogOptions } from './schema.js';

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
	defaultChange,
	readmeTxtFile,
	prevChangesPattern,
	packageName,
	version,
}: UpdateChangelogConfig) {
	let readmeTxt = fs.readFileSync(readmeTxtFile, 'utf8');

	const versionStr = `= ${version} =`;

	const prevChangesRegex =
		prevChangesPattern.pattern instanceof RegExp
			? prevChangesPattern.pattern
			: new RegExp(
					prevChangesPattern.pattern,
					'flags' in prevChangesPattern ? prevChangesPattern.flags : 's',
				);

	const prevChanges = readmeTxt.match(prevChangesRegex);

	/**
	 * The pattern must have a capturing group for actual changes.
	 *
	 * If the version is already in the changelog, skip.
	 */
	if (!prevChanges?.[1] || prevChanges[0].includes(versionStr)) {
		return;
	}

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

	if (!changes.length) {
		changes.push(`- ${defaultChange}`);
	}

	const changesStr = changes.join('\n');

	// Replace the captured group with the new changes
	const updatedChanges = prevChanges[0].replace(
		prevChanges[1],
		`${versionStr}\n${changesStr}`,
	);

	readmeTxt = readmeTxt.replace(prevChangesRegex, updatedChanges);

	fs.writeFileSync(readmeTxtFile, readmeTxt);
}
