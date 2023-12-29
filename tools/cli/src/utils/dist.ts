import fs from 'node:fs';
import path from 'node:path';
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

		console.log({ entries, filesToUpdate, item, patterns });

		const replaceCallback = (match: string, $1: string) => {
			return match.replace($1, version);
		};

		for (const file of entries) {
			const filePath = path.join(project, file);
			// console.log(filePath);

			let fileContents = fs.readFileSync(filePath, 'utf8');

			for (const pattern of patterns) {
				fileContents = fileContents.replace(pattern, replaceCallback);
			}

			// fs.writeFileSync(filePath, fileContents);
		}
	}
}
