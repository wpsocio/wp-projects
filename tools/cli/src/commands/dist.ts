import { Flags } from '@oclif/core';
import chalk from 'chalk';
import { Listr, ListrTask } from 'listr2';
import { BaseProjectCommand } from '../baseProjectCommand.js';
import {
	generatePotFile,
	makeMoFiles,
	potToPhp,
	updatePoFiles,
} from '../utils/i18n.js';
import { getNextVersion } from '../utils/projects.js';
import { updateRequirements } from '../utils/requirements.js';
import { processStyles } from '../utils/styles.js';
import { updateVersion } from '../utils/versions.js';

export default class Dist extends BaseProjectCommand<typeof Dist> {
	static description = 'Prepares projects for distribution or deployment.';

	static flags = {
		'out-dir': Flags.string({
			char: 'd',
			description:
				'Path to the output directory. Defaults to "dist/{project}".',
		}),
		version: Flags.string({
			char: 'v',
			description: 'Version to update to.',
			exclusive: ['version-type'],
		}),
		'release-type': Flags.string({
			char: 't',
			description: 'Release type to update to. Defaults to "patch".',
			exclusive: ['version'],
			options: [
				'major',
				'minor',
				'patch',
				'premajor',
				'preminor',
				'prepatch',
				'prerelease',
			],
		}),
	};

	static args = {
		...BaseProjectCommand.args,
	};

	public async run(): Promise<void> {
		const tasks = new Listr([], {
			concurrent: true,
		});

		for (const project of this.projects) {
			tasks.add({
				title: `Preparing ${project}`,
				task: (_, task) => {
					return task.newListr(this.prepareForDist(project), {
						concurrent: false,
					});
				},
			});
		}

		try {
			await tasks.run();
		} catch (error) {
			this.log(chalk.red((error as { message: string }).message));
			process.exitCode = 1;
		}
	}

	prepareForDist(project: string): Array<ListrTask> {
		const version =
			this.flags.version || getNextVersion(project, this.flags['release-type']);

		if (!version) {
			throw new Error(
				'Could not calculate the next version. Is the current version a valid semver?',
			);
		}

		const projectSlug = project.split('/')[1];
		const projectName = projectSlug.replace('-', '_');

		const outDir = this.flags['out-dir'] || `dist/${project}`;

		return [
			{
				title: 'Update requirements',
				task: async (): Promise<void> => {
					await updateRequirements(project, {
						requirements: {
							requiresPHP: '8.0',
							requiresAtLeast: '6.2',
							testedUpTo: '6.4.1',
						},
						toUpdate: {
							files: [
								'dev.php',
								`src/${projectSlug}.php`,
								'src/README.txt',
								'README.md',
							],
						},
					});
				},
			},
			{
				title: 'Update version',
				task: async (): Promise<void> => {
					await updateVersion(project, version, {
						toUpdate: [
							{
								type: 'packageJson',
							},
							{
								type: 'composerJson',
							},
							{
								type: 'readmeFiles',
							},
							{
								type: 'pluginMainFile',
							},
							{
								type: 'sinceTag',
							},
							{
								type: 'general',
								files: [`src/${projectSlug}.php`],
								textPatterns: [
									`'${projectName.toUpperCase()}_VER',\\s*'([0-9a-z-+.]+)'`,
								],
							},
						],
					});
				},
			},
			/* {
				title: 'Update changelog',
				task: async (): Promise<void> => {
					await updateChangelog(project, version, {
						changelogPath: 'changelog.md',
						readmeTxt: {
							files: ['src/README.txt'],
						},
					});
				},
			}, */
			{
				title: 'i18n',
				task: async (_, task) => {
					return task.newListr(
						[
							{
								title: 'Generate POT file',
								task: async () => {
									await generatePotFile(project, {
										source: 'src',
										textDomain: projectSlug,
										headers: {
											language: 'en_US',
											'X-Poedit-Basepath': '..',
											'Plural-Forms': 'nplurals=2; plural=n != 1;',
											'X-Poedit-KeywordsList':
												'__;_e;_x;esc_attr__;esc_attr_e;esc_html__;esc_html_e',
											'X-Poedit-SearchPath-0': '.',
											'X-Poedit-SearchPathExcluded-0': 'assets',
										},
										mergeFiles: ['src/languages/js-translations.pot'],
										makePotArgs: {
											slug: projectSlug,
										},
									});
								},
							},
							{
								title: 'Update PO and MO files',
								task: async () => {
									await updatePoFiles(project, {
										source: `src/languages/${projectSlug}.pot`,
									});
									await makeMoFiles(project, {
										source: 'src/languages/',
									});
								},
							},
							{
								// Generate PHP file from JS POT file
								// for wp.org to scan the translation strings
								title: 'JS POT to PHP',
								task: async () => {
									await potToPhp(project, {
										potFile: 'src/languages/js-translations.pot',
										textDomain: projectSlug,
									});
								},
							},
						],
						{ concurrent: false },
					);
				},
			},
			{
				title: 'Process styles',
				task: async (_, task) => {
					return task.newListr(
						[
							{
								title: 'Minify CSS',
								task: async () => {
									await processStyles(project, {
										files: ['src/assets/static/css/*.css'],
										ignore: ['src/assets/static/css/*.min.css'],
									});
								},
							},
						],
						{ concurrent: false },
					);
				},
			},
		];
	}
}
