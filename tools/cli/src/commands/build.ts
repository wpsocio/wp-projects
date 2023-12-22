import fs from 'node:fs';
import path from 'node:path';
import { createViteConfig } from '@wpsocio/dev/vite';
import Listr from 'listr';
import { rimraf } from 'rimraf';
import { build } from 'vite';
import { Argv } from 'yargs';
import { InferBuilderOptions } from '../types.js';
import {
	getMonorepoProjects,
	getRealPath,
	validateProject,
} from '../utils/projects.js';

export const command = 'build [projects...]';

export const describe = 'Builds the given project(s) in this monorepo.';

export function builder(yargs: Argv) {
	return yargs
		.positional('projects', {
			describe: 'Project(s) to build, e.g. plugins/wptelegram themes/wptest.',
			type: 'string',
			// array: true, Array option works weirdly with positional arguments
			// in order to provide support for comma separated values, we need to use coerce
			coerce(projects: Array<string>) {
				// Comma gets converted to space by yargs
				return projects
					.flatMap((project) => project.split(/\s+/))
					.map((part) => part.trim())
					.filter(Boolean);
			},
		})
		.option('all', {
			describe: 'Build all projects.',
			type: 'boolean',
		});
}

type HandlerArgs = InferBuilderOptions<ReturnType<typeof builder>>;

export async function handler(argv: HandlerArgs) {
	const projects = argv.all ? getMonorepoProjects() : new Set(argv.projects);

	for (const project of projects) {
		validateProject(project);
	}

	const taskList: Array<Listr.ListrTask> = [];

	for (const project of projects) {
		taskList.push({
			title: `Build ${project}`,
			task: async (ctx, task) => {
				const projectPath = getRealPath(project);
				const buildConfigPath = path.join(projectPath, 'build-config.json');

				if (!fs.existsSync(buildConfigPath)) {
					task.skip(`No build-config.json found for ${project}.`);
					return;
				}

				const buildConfigJson = fs.readFileSync(buildConfigPath);
				const buildConfig = JSON.parse(buildConfigJson.toString());

				const entryBuildTasks: Array<Listr.ListrTask> = [];

				let manifest = {};
				let dependencies = {};

				const outDir = path.join(
					projectPath,
					buildConfig.outDir || 'src/assets/build',
				);

				await rimraf(outDir);

				for (const [entryName, entry] of Object.entries(buildConfig.input)) {
					const config = createViteConfig(
						{
							input: {
								[entryName]: path.join(projectPath, `${entry}`),
							},
							outDir,
						},
						{ emptyOutDir: false },
					);

					entryBuildTasks.push({
						title: `Build ${entryName}`,
						task: async (_, task) => {
							task.output = `Building ${project}/${entryName}`;
							const result = await build({
								root: projectPath,
								publicDir: false,
								...config,
								configFile: false,
							});

							if ('output' in result) {
								for (const item of result.output) {
									if (
										item.type !== 'asset' ||
										typeof item.source !== 'string'
									) {
										continue;
									}

									if (item.fileName === 'manifest.json') {
										manifest = { ...manifest, ...JSON.parse(item.source) };
									} else if (item.fileName === 'dependencies.json') {
										dependencies = {
											...dependencies,
											...JSON.parse(item.source),
										};
									}
								}
							}
						},
					});
				}

				const entryTasks = new Listr(entryBuildTasks, { concurrent: true });

				try {
					await entryTasks.run();

					fs.writeFileSync(
						path.join(outDir, 'manifest.json'),
						JSON.stringify(manifest, null, 2),
					);

					fs.writeFileSync(
						path.join(outDir, 'dependencies.json'),
						JSON.stringify(dependencies, null, 2),
					);
				} catch (error) {
					console.error(`Build failed for ${project}.`, error);
				}
			},
		});
	}

	const tasks = new Listr(taskList, { concurrent: true });

	try {
		await tasks.run();
	} catch (error) {
		console.error('Build failed.', error);
	}
}
