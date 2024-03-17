import fs from 'node:fs';
import path from 'node:path';
import { Flags } from '@oclif/core';
import chalk from 'chalk';
import { Listr, ListrTask } from 'listr2';
import { WithProjects } from '../base-commands/WithProjects.js';
import { updateChangelog } from '../utils/changelog.js';
import { makeMo, makePhp, makePot, potToPhp, updatePo } from '../utils/i18n.js';
import { copyFiles, getDistIgnorePattern, zipDir } from '../utils/misc.js';
import {
	WPProject,
	getNextVersion,
	getProjectBundleConfig,
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
			description: 'Path to the output directory. Defaults to "dist".',
			default: 'dist',
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
		tasks: Flags.string({
			description: 'Run only the specified tasks. Comma-separated list.',
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

	public async run(): Promise<void> {
		const tasks = new Listr([], {
			concurrent: true,
		});

		for (const [name, project] of this.projects) {
			tasks.add({
				title: `Preparing ${project.packageJson.name}`,
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

	getOutputDir(project: WPProject) {
		const baseOutDir = this.flags['out-dir'] || 'dist';

		if (this.cliConfig.operationMode !== 'wp-monorepo') {
			return baseOutDir;
		}

		const relativePath = path.relative(this.cliConfig.rootDir, project.dir);

		return path.join(this.cliConfig.rootDir, baseOutDir, relativePath);
	}

	getVersion(project: WPProject, task: TaskWrapper) {
		if (!this.flags.version && !this.flags['release-type']) {
			// Use the current version if no version or release type is provided
			return project.packageJson.version;
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

	async prepareForDist(project: WPProject, task: TaskWrapper) {
		const version = this.getVersion(project, task);

		const projectInfo = project.wpdev;

		const bundle = await getProjectBundleConfig(project, { version });

		const outDir = this.getOutputDir(project);

		// Clean up output directory
		if (fs.existsSync(outDir)) {
			fs.rmSync(outDir, { recursive: true });
		}

		const projectDir = project.dir;

		const tasksToRun = this.flags.tasks?.split(',') || [];

		const taskList = tasksToRun.length
			? bundle.tasks.filter((tsk) => tasksToRun.includes(tsk.type))
			: bundle.tasks;

		if (!taskList.length) {
			task.skip('No tasks to run. Skipping.');
			return;
		}

		return task.newListr(
			taskList.map(({ type: taskType, data: taskData }) => {
				switch (taskType) {
					case 'run-scripts':
						return {
							title: 'Run scripts',
							skip: () => !taskData.length,
							task: async (_, task) => {
								return task.newListr(
									taskData.map((script) => {
										return {
											title: `Running "${script}"`,
											task: async () => {
												return await runScript(
													project.dir,
													script,
													this.flags['package-manager'],
												);
											},
										};
									}),
								);
							},
						};

					case 'update-requirements':
						return {
							title: 'Update requirements',
							task: async () => {
								return await updateRequirements(projectDir, taskData);
							},
						};

					case 'update-version':
						return {
							title: 'Updating version',
							task: async () => {
								return await updateVersion(projectDir, version, {
									slug: projectInfo.slug,
									target: taskData,
								});
							},
						};

					case 'update-changelog':
						return {
							title: 'Update changelog',
							task: async () => {
								if (!this.flags['changeset-json']) {
									return task.skip(
										'No changeset file provided. Skipping changelog update.',
									);
								}
								const { readmeTxtFile, ...config } = taskData;

								return updateChangelog({
									changesetJsonFile: this.flags['changeset-json'],
									readmeTxtFile: path.join(project.dir, readmeTxtFile),
									...config,
									packageName: project.packageJson.name,
									version,
								});
							},
						};

					case 'i18n-make-pot':
						return {
							title: 'I18N: Make POT',
							task: async () => {
								return await makePot(projectDir, {
									textDomain: projectInfo.textDomain,
									...taskData,
								});
							},
						};

					case 'i18n-update-po':
						return {
							title: 'I18N: Update PO files',
							task: async () => {
								return await updatePo(projectDir, {
									source: `src/languages/${projectInfo.textDomain}.pot`,
									...taskData,
								});
							},
						};

					case 'i18n-make-mo':
						return {
							title: 'I18N: Make MO files',
							task: async () => {
								const { source, destination } = taskData;

								return await makeMo(projectDir, {
									source: source || 'src/languages/',
									destination: destination,
								});
							},
						};

					case 'i18n-make-php':
						return {
							title: 'I18N: Make PHP files',
							task: async () => {
								const { source, destination } = taskData;

								return await makePhp(projectDir, {
									source: source || 'src/languages/',
									destination: destination,
								});
							},
						};

					case 'i18n-js-pot-to-php':
						return {
							title: 'I18N: JS POT to PHP',
							task: async () => {
								const { potFile, textDomain, phpFile } = taskData;

								return await potToPhp(projectDir, {
									potFile: potFile || 'src/languages/js-translations.pot',
									textDomain: textDomain || projectInfo.textDomain,
									outFile: phpFile,
								});
							},
						};

					case 'minify-styles':
						return {
							title: 'Minify CSS',
							task: async () => {
								return await minifyStyles(projectDir, taskData);
							},
						};

					case 'copy-files':
						return {
							title: 'Copy files',
							task: async () => {
								const {
									stripFromPath,
									files,
									ignore = getDistIgnorePattern(project.dir),
								} = taskData;

								return await copyFiles(
									project.dir,
									{ files, ignore },
									outDir,
									stripFromPath,
								);
							},
						};

					case 'create-archive':
						return {
							title: 'Create archive',
							skip: () => !this.flags.archive,
							task: async () => {
								task.output = await zipDir(
									outDir,
									path.join(
										path.dirname(outDir),
										taskData.outPath || `${projectInfo.slug}-${version}.zip`,
									),
								);
							},
						};
				}
			}),
			{
				concurrent: false,
			},
		);
	}
}
