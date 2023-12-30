import { Flags } from '@oclif/core';
import chalk from 'chalk';
import { Listr, ListrTask, delay } from 'listr2';
import { BaseProjectCommand } from '../baseProjectCommand.js';
import {
	generatePotFile,
	makeMoFiles,
	updatePoFiles,
	updateRequirements,
	updateVersion,
} from '../utils/dist.js';

export default class Dist extends BaseProjectCommand<typeof Dist> {
	static description = 'Prepares projects for distribution or deployment.';

	static flags = {
		'out-dir': Flags.string({
			char: 'd',
			description:
				'Path to the output directory. Defaults to "dist/{project}".',
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
		const projectSlug = project.split('/')[1];
		const projectName = projectSlug.replace('-', '_');
		return [
			{
				title: 'Update requirements',
				task: async (): Promise<void> => {
					await delay(1000);
					await updateRequirements(project, {
						requirements: {
							requiresPHP: '8.0',
							requiresAtLeast: '6.2',
							testedUpTo: '6.4.1',
						},
						toUpdate: {
							files: [
								'dev.php',
								'src/wptelegram.php',
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
					await delay(1000);
					await updateVersion(project, '5.0.1', {
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
					await updateChangelog(project, '5.0.1', {
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
					await delay(1000);
					return task.newListr(
						[
							/* 
							{
								title: 'JS POT to PHP',
								task: async () => {
									await potToPhp(project, {
										potFile: 'src/languages/js-translations.pot',
										textDomain: 'wptelegram',
									});
								},
							}, */
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
										source: 'src/languages/wptelegram.pot',
									});
									await makeMoFiles(project, {
										source: 'src/languages/',
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
