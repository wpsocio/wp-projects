import path from 'node:path';
import { Flags } from '@oclif/core';
import chalk from 'chalk';
import { Listr, ListrTask } from 'listr2';
import { WithProjects } from '../base-commands/WithProjects.js';
import {
	generatePotFile,
	makeMoFiles,
	potToPhp,
	updatePoFiles,
} from '../utils/i18n.js';
import { copyDir, getDistIgnorePattern, zipDir } from '../utils/misc.js';
import {
	getCurrentVersion,
	getNextVersion,
	getProjectConfig,
	runScript,
} from '../utils/projects.js';
import { updateRequirements } from '../utils/requirements.js';
import { minifyStyles } from '../utils/styles.js';
import { updateVersion } from '../utils/versions.js';

type TaskWrapper = Parameters<ListrTask['task']>[1];

export default class Bundle extends WithProjects<typeof Bundle> {
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
			exclusive: ['release-type'],
		}),
		'release-type': Flags.string({
			char: 't',
			description: 'Release type to update to.',
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
		...WithProjects.args,
	};

	protected destPlaceholder = '{project}';

	public async run(): Promise<void> {
		const tasks = new Listr([], {
			concurrent: true,
		});

		for (const project of this.projects) {
			tasks.add({
				title: `Preparing ${project}`,
				task: async (_, task) => {
					return await this.prepareForDist(project, task);
				},
				rendererOptions: {
					persistentOutput: true,
				},
			});
		}

		try {
			await tasks.run();
		} catch (error) {
			if (
				typeof error === 'object' &&
				error &&
				'message' in error &&
				error.message
			) {
				this.log(chalk.red(error.message), error);
			}
			this.exit(1);
		}
	}

	getOutputDir() {
		if (this.flags['out-dir']) {
			return this.projects.size === 1
				? this.flags['out-dir']
				: path.join(this.flags['out-dir'], this.destPlaceholder);
		}

		return `dist/${this.destPlaceholder}`;
	}

	parseOutputDir(outDir: string, project: string) {
		return outDir.replace(this.destPlaceholder, project);
	}

	getVersion(project: string, task: TaskWrapper) {
		if (!this.flags.version && !this.flags['release-type']) {
			return getCurrentVersion(project);
		}

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

	async prepareForDist(project: string, task: TaskWrapper) {
		const version = this.getVersion(project, task);

		const { projectInfo, bundle } = await getProjectConfig(project, version);

		const outDir = this.parseOutputDir(this.getOutputDir(), project);

		const canChangeSourceFiles = this.flags['update-source-files'];

		const cwd = canChangeSourceFiles ? project : outDir;

		const preScripts = this.flags['pre-script'] || bundle.tasks.preScripts;
		const postScripts = this.flags['post-script'] || bundle.tasks.postScripts;

		return task.newListr(
			[
				{
					title: 'Run pre-scripts',
					skip: () => !preScripts?.length,
					task: async (_, task) => {
						return task.newListr(
							(preScripts || []).map((script) => {
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
					task: async (_, task) => {
						if (!bundle.tasks.copyFilesBefore) {
							return task.skip();
						}

						const {
							sourceDir,
							destDir,
							ignore = getDistIgnorePattern(project),
						} = bundle.tasks.copyFilesBefore;

						return await copyDir(
							path.join(project, sourceDir),
							this.parseOutputDir(destDir, project),
							{ ignore },
						);
					},
				},
				{
					title: 'Update requirements',
					task: async (_, task) => {
						if (!bundle.tasks.updateRequirements) {
							return task.skip();
						}

						return await updateRequirements(
							cwd,
							bundle.tasks.updateRequirements,
						);
					},
				},
				{
					title: 'Update version',
					skip: () => !this.flags.version && !this.flags['release-type'],
					task: async (_, task) => {
						if (!bundle.tasks.updateVersion) {
							return task.skip();
						}

						return await updateVersion(cwd, version, {
							slug: projectInfo.slug,
							target: bundle.tasks.updateVersion,
						});
					},
				},
				{
					title: 'i18n',
					task: async (_, i18nTask) => {
						return i18nTask.newListr(
							[
								{
									title: 'Generate POT file',
									task: async (_, task) => {
										if (!bundle.tasks.generatePot) {
											return task.skip();
										}

										return await generatePotFile(cwd, {
											textDomain: projectInfo.textDomain,
											...bundle.tasks.generatePot,
										});
									},
								},
								{
									title: 'Update PO files',
									task: async (_, task) => {
										if (!bundle.tasks.updatePoFiles) {
											return task.skip();
										}

										return await updatePoFiles(cwd, {
											source: `src/languages/${projectInfo.textDomain}.pot`,
											...bundle.tasks.updatePoFiles,
										});
									},
								},
								{
									title: 'Make MO files',
									task: async (_, task) => {
										if (!bundle.tasks.makeMoFiles) {
											return task.skip();
										}
										const { source } = bundle.tasks.makeMoFiles;

										return await makeMoFiles(cwd, {
											source: source || 'src/languages/',
										});
									},
								},
								{
									// Generate PHP file from JS POT file
									// for wp.org to scan the translation strings
									title: 'JS POT to PHP',
									task: async (_, task) => {
										if (!bundle.tasks.jsPotToPhp) {
											return task.skip();
										}
										const { potFile, textDomain } = bundle.tasks.jsPotToPhp;

										return await potToPhp(cwd, {
											potFile: potFile || 'src/languages/js-translations.pot',
											textDomain: textDomain || projectInfo.textDomain,
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
					task: async (_, stylesTask) => {
						if (!bundle.tasks.minifyStyles) {
							return stylesTask.skip();
						}
						return stylesTask.newListr(
							[
								{
									title: 'Minify CSS',
									task: async (_, task) => {
										if (!bundle.tasks.minifyStyles) {
											return task.skip();
										}

										return await minifyStyles(cwd, bundle.tasks.minifyStyles);
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
					task: async (_, task) => {
						if (!bundle.tasks.copyFilesAfter) {
							return task.skip();
						}

						const {
							sourceDir,
							destDir,
							ignore = getDistIgnorePattern(project),
						} = bundle.tasks.copyFilesAfter;

						return await copyDir(
							path.join(project, sourceDir),
							this.parseOutputDir(destDir, project),
							{ ignore },
						);
					},
				},
				{
					title: 'Run post-scripts',
					skip: () => !postScripts?.length,
					task: async (_, task) => {
						return task.newListr(
							(postScripts || []).map((script) => {
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
					skip: () => !this.flags.archive && !bundle.tasks.createArchive,
					task: async () => {
						const outPath = bundle.tasks.createArchive?.outPath;

						return await zipDir(
							outDir,
							path.join(
								path.dirname(outDir),
								outPath || `${projectInfo.slug}-${version}.zip`,
							),
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
