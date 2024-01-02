import path from 'node:path';
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
import { copyDir, getDistIgnorePattern, zipDir } from '../utils/misc.js';
import { getNextVersion, runScript } from '../utils/projects.js';
import { updateRequirements } from '../utils/requirements.js';
import { processStyles } from '../utils/styles.js';
import { updateVersion } from '../utils/versions.js';

type TaskWrapper = Parameters<ListrTask['task']>[1];

export default class Bundle extends BaseProjectCommand<typeof Bundle> {
	static description =
		'Prepares and bundles projects for distribution or deployment.';

	static flags = {
		'out-dir': Flags.string({
			char: 'd',
			description:
				'Path to the output directory. Defaults to "dist/{project}".',
		}),
		'update-source-files': Flags.boolean({
			char: 'u',
			description: 'Update the source files.',
			default: true,
			allowNo: true,
		}),
		'pre-script': Flags.string({
			char: 'b',
			description: 'Script to run before bundling.',
			multiple: true,
		}),
		'post-script': Flags.string({
			char: 'a',
			description: 'Script to run after bundling.',
			multiple: true,
		}),
		'package-manager': Flags.string({
			char: 'p',
			description: 'Package manager to use.',
			options: ['npm', 'yarn', 'pnpm', 'bun'],
			default: 'npm',
		}),
		archive: Flags.boolean({
			char: 'c',
			description: 'Create a compressed archive (zip) of the bundled project.',
			default: true,
			allowNo: true,
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

	protected placeholder = '{project}';

	public async run(): Promise<void> {
		const tasks = new Listr([], {
			concurrent: true,
		});

		for (const project of this.projects) {
			tasks.add({
				title: `Preparing ${project}`,
				task: (_, task) => {
					return this.prepareForDist(project, task);
				},
				rendererOptions: {
					persistentOutput: true,
				},
			});
		}

		try {
			await tasks.run();
		} catch (error) {
			this.error(chalk.red((error as { message: string }).message));
		}
	}

	getOutputDir() {
		if (this.flags['out-dir']) {
			return this.projects.size === 1
				? this.flags['out-dir']
				: path.join(this.flags['out-dir'], this.placeholder);
		}

		return `dist/${this.placeholder}`;
	}

	getVersion(project: string, task: TaskWrapper) {
		let version = this.flags.version;

		if (!version) {
			const releaseType = this.flags['release-type'] || 'patch';

			version = getNextVersion(project, releaseType) || '';

			if (!version) {
				this.error(
					chalk.red(
						'Could not calculate the next version. Is the current version a valid semver?',
					),
				);
			}

			task.output = `Preparing for "${chalk.bold(
				releaseType,
			)}" (v${version}) release`;
		} else {
			task.output = `Preparing "v${chalk.bold(version)}"`;
		}
		return version;
	}

	prepareForDist(project: string, task: TaskWrapper) {
		const version = this.getVersion(project, task);

		const projectSlug = project.split('/')[1];
		const projectName = projectSlug.replace('-', '_');

		const outDir = this.getOutputDir().replace(this.placeholder, project);

		const canChangeSourceFiles = this.flags['update-source-files'];

		const cwd = canChangeSourceFiles ? project : outDir;

		return task.newListr(
			[
				{
					title: 'Run pre-scripts',
					skip: () => !this.flags['pre-script']?.length,
					task: async (_, task) => {
						return task.newListr(
							(this.flags['pre-script'] || []).map((script) => {
								return {
									title: `Running "${script}"`,
									task: async () => {
										return await runScript(
											project,
											script,
											this.flags['package-manager'],
										);
									},
								};
							}),
						);
					},
				},
				{
					title: 'Copy files before changing',
					skip: () => canChangeSourceFiles,
					task: async () => {
						const distignore = getDistIgnorePattern(project);

						return await copyDir(`${project}/src`, outDir, {
							ignore: distignore,
						});
					},
				},
				{
					title: 'Update requirements',
					task: async () => {
						return await updateRequirements(cwd, {
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
					task: async () => {
						return await updateVersion(cwd, version, {
							slug: projectSlug,
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
										return await generatePotFile(cwd, {
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
										await updatePoFiles(cwd, {
											source: `src/languages/${projectSlug}.pot`,
										});
										return await makeMoFiles(cwd, {
											source: 'src/languages/',
										});
									},
								},
								{
									// Generate PHP file from JS POT file
									// for wp.org to scan the translation strings
									title: 'JS POT to PHP',
									task: async () => {
										return await potToPhp(cwd, {
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
										return await processStyles(cwd, {
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
				{
					title: 'Copy files after changing',
					skip: () => !canChangeSourceFiles,
					task: async () => {
						const distignore = getDistIgnorePattern(project);

						return await copyDir(`${project}/src`, outDir, {
							ignore: distignore,
						});
					},
				},
				{
					title: 'Run post-scripts',
					skip: () => !this.flags['post-script']?.length,
					task: async (_, task) => {
						return task.newListr(
							(this.flags['post-script'] || []).map((script) => {
								return {
									title: `Running "${script}"`,
									task: async () => {
										return await runScript(
											project,
											script,
											this.flags['package-manager'],
										);
									},
								};
							}),
						);
					},
				},
				{
					title: 'Create archive',
					skip: () => !this.flags.compress,
					task: async () => {
						return await zipDir(
							outDir,
							`${path.dirname(outDir)}/${projectSlug}-${version}.zip`,
						);
					},
				},
			],
			{
				concurrent: false,
			},
		);
	}
}
