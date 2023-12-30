import fs from 'node:fs';
import path from 'node:path';
import { $, execa } from 'execa';
import fg, { Options } from 'fast-glob';

export type Requirements = {
	requiresPHP: string;
	requiresAtLeast: string;
	testedUpTo: string;
};

export type ToUpdate = {
	files: string | Array<string>;
	ignore?: Array<string>;
};

export type RequirementsConfig = {
	requirements: Requirements;
	toUpdate: ToUpdate;
};

function globFiles(toUpdate: ToUpdate, options?: Options) {
	return fg.sync(toUpdate.files, {
		ignore: toUpdate.ignore,
		...options,
	});
}

/**
 * Updates the requirements in README.txt and the main file of the project.
 *
 * For plugins, it's the plugin main file
 * For themes, it's the style.css file
 */
export async function updateRequirements(
	project: string,
	{ requirements, toUpdate }: RequirementsConfig,
) {
	const strings: Requirements = {
		requiresAtLeast: 'Requires at least',
		requiresPHP: 'Requires PHP',
		testedUpTo: 'Tested up to',
	};

	const entries = globFiles(toUpdate, { cwd: project });

	for (const file of entries) {
		const filePath = path.join(project, file);
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

export type UpdateVersionConfig = {
	toUpdate: Array<
		Partial<ToUpdate> &
			(
				| {
						type:
							| 'packageJson'
							| 'composerJson'
							| 'readmeFiles'
							| 'pluginMainFile'
							| 'themeStylesheet'
							| 'sinceTag';
				  }
				| {
						files: string | Array<string>;
						type: 'general';
						textPatterns: Array<RegExp | string>;
				  }
			)
	>;
};

function createVersionPatterns(toUpdate: UpdateVersionConfig['toUpdate'][0]) {
	switch (toUpdate.type) {
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
			return toUpdate.textPatterns.map((pattern) => {
				if (typeof pattern === 'string') {
					return new RegExp(pattern, 'gi');
				}
				return pattern;
			});
	}
}

function getFilesToUpdate(
	{ type, ...item }: UpdateVersionConfig['toUpdate'][0],
	project: string,
) {
	let filesToUpdate: ToUpdate;

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
				files: ['README.md', 'src/README.txt'],
				...item,
			};
			break;

		case 'pluginMainFile':
			filesToUpdate = {
				/**
				 * e.g. if project is plugins/wptelegram, then files will be
				 * ['src/wptelegram.php']
				 */
				files: [`src/${project.split('/')[0] || 'main'}.php`],
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
	project: string,
	version: string,
	{ toUpdate }: UpdateVersionConfig,
) {
	for (const item of toUpdate) {
		const patterns = createVersionPatterns(item);
		const filesToUpdate = getFilesToUpdate(item, project);

		const entries = globFiles(filesToUpdate, { cwd: project });

		const replaceCallback = (match: string, $1: string) => {
			return match.replace($1, version);
		};

		for (const file of entries) {
			const filePath = path.join(project, file);

			let fileContents = fs.readFileSync(filePath, 'utf8');

			for (const pattern of patterns) {
				fileContents = fileContents.replace(pattern, replaceCallback);
			}

			fs.writeFileSync(filePath, fileContents);
		}
	}
}

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

export type PotToPhpConfig = {
	potFile: string;
	textDomain: string;
	outFile?: string;
};

/**
 * Converts JS POT file to PHP using @wordpress/i18n
 */
export async function potToPhp(
	project: string,
	{ potFile, textDomain, outFile }: PotToPhpConfig,
) {
	const potDir = path.dirname(potFile);

	const outFilePath =
		outFile || path.join(potDir, `${textDomain}-js-translations.php`);

	const args = [potFile, outFilePath, textDomain];

	// `pot-to-php` binary comes from @wordpress/i18n
	await $({ cwd: project })`pot-to-php ${args}`;
}

export type GeneratePotFileConfig = Pick<
	PotToPhpConfig,
	'outFile' | 'textDomain'
> & {
	source?: string;
	makePotArgs?: Record<string, string>;
	headers?: Record<string, string>;
	mergeFiles?: Array<string>;
};

export async function generatePotFile(
	project: string,
	{
		outFile,
		textDomain,
		source,
		headers,
		mergeFiles = [],
		makePotArgs = {},
	}: GeneratePotFileConfig,
) {
	const extraArgs: Record<string, string> = {
		domain: textDomain,
		headers: JSON.stringify(headers || {}),
		...makePotArgs,
	};

	const outFilePath = outFile || `src/languages/${textDomain}.pot`;

	let args = [source || '.', outFilePath];

	for (const [flag, value] of Object.entries(extraArgs)) {
		args.push(value ? `--${flag}=${value}` : `--${flag}`);
	}

	if (mergeFiles.length > 0) {
		args.push(`--merge=${mergeFiles.join(',')}`);
	}

	// Replace & with a placeholder because execa doesn't work with & in args on Windows
	const placeholder = '____amp____';
	args = args.map((arg) => arg.replaceAll('&', placeholder));

	const result = await $({ cwd: project })`wp i18n make-pot ${args}`;

	// Replace the placeholder back with &
	const content = fs
		.readFileSync(path.join(project, outFilePath), 'utf8')
		.replaceAll(placeholder, '&');

	fs.writeFileSync(path.join(project, outFilePath), content);

	return result;
}

export type UpdatePoFilesConfig = {
	source: string;
	destination?: string;
};

export async function updatePoFiles(
	project: string,
	{ source, destination }: UpdatePoFilesConfig,
) {
	const dest = destination || path.dirname(source);
	return await $({ cwd: project })`wp i18n update-po ${source} ${dest}`;
}

export async function makeMoFiles(
	project: string,
	{ source, destination }: UpdatePoFilesConfig,
) {
	const dest = destination || source;
	return await $({ cwd: project })`wp i18n make-mo ${source} ${dest}`;
}
