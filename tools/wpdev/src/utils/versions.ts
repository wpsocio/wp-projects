import fs from 'node:fs';
import path from 'node:path';
import { prerelease } from 'semver';
import { type TaskTarget, globFiles } from './misc.js';
import type { UpdateVersionInput } from './schema.js';

export type UpdateVersionConfig = {
	slug?: string;
	target: UpdateVersionInput;
};

function createVersionPatterns(
	target: UpdateVersionConfig['target'][0],
): Array<RegExp> {
	switch (target.type) {
		case 'packageJson':
		case 'composerJson':
			// Allow any type of version string
			return [/"version":[^"]*"([0-9a-z-+.]+)"/i];

		case 'readmeFiles':
			return [/Stable tag:[^0-9a-z-+.]*?([0-9a-z-+.]+)/i];

		case 'pluginMainFile':
		case 'themeStylesheet':
			return [/Version:\s*([0-9a-z-+.]+)/i];

		case 'sinceTag':
			// Since tag needs to be replaced globally
			return [/@since[\s\t]*(x\.?y\.?z)/gi, /((?:since:)x\.?y\.?z)/gi];

		case 'general':
			return target.textPatterns.map((item) => {
				if (typeof item.pattern === 'string') {
					const flags = 'flags' in item ? item.flags : 'gi';

					return new RegExp(item.pattern, flags);
				}
				return item.pattern;
			});
	}
}

function getFilesToUpdate(
	{ type, ...item }: UpdateVersionConfig['target'][0],
	slug?: string,
) {
	let filesToUpdate: TaskTarget;

	switch (type) {
		case 'packageJson':
		case 'composerJson':
			filesToUpdate = {
				files: ['package.json', 'composer.json'],
				...item,
			};
			break;

		case 'readmeFiles':
			filesToUpdate = {
				files: ['README.md', 'src/README.txt', 'src/readme.txt'],
				...item,
			};
			break;

		case 'pluginMainFile':
			filesToUpdate = {
				files: [`src/${slug || 'main'}.php`],
				...item,
			};
			break;

		case 'themeStylesheet':
			filesToUpdate = {
				files: ['style.css'],
				...item,
			};
			break;

		case 'sinceTag':
		case 'general':
			filesToUpdate = {
				files: ['**/*.php'],
				...item,
			};
			break;
	}

	return {
		ignore: ['**/node_modules/**', '**/vendor/**'],
		...filesToUpdate,
	};
}

/**
 * Updates the version string in different files
 */
export async function updateVersion(
	cwd: string,
	version: string,
	{ target, slug }: UpdateVersionConfig,
) {
	for (const item of target) {
		if (
			item.type === 'sinceTag' &&
			item.onlyIfStable &&
			!isVersionStable(version)
		) {
			continue;
		}
		const patterns = createVersionPatterns(item);
		const filesToUpdate = getFilesToUpdate(item, slug);

		const entries = globFiles(filesToUpdate, { cwd });

		const replaceCallback = (match: string, $1: string) => {
			return match.replace($1, version);
		};

		for (const file of entries) {
			const filePath = path.join(cwd, file);

			let fileContents = fs.readFileSync(filePath, 'utf8');

			for (const pattern of patterns) {
				fileContents = fileContents.replace(pattern, replaceCallback);
			}

			fs.writeFileSync(filePath, fileContents);
		}
	}
}

export function isVersionStable(version: string) {
	return prerelease(version) === null;
}
