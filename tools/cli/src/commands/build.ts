import fs from 'node:fs';
import path from 'node:path';
import { createViteConfig } from '@wpsocio/dev/vite';
import Listr from 'listr';
import { build } from 'vite';
import { Argv } from 'yargs';
import { InferBuilderOptions } from '../types.js';
import {
	getAllProjects,
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
	const projects = new Set(argv.all ? getAllProjects() : argv.projects);

	for (const project of projects) {
		validateProject(project);
	}

	const taskList = [];

	for (const project of projects) {
		taskList.push({
			title: `Building ${project}`,
			task: () => {
				const projectPath = getRealPath(project);

				const buildConfigJson = fs.readFileSync(
					path.join(projectPath, 'build-config.json'),
				);
				const buildConfig = JSON.parse(buildConfigJson.toString());

				const entryBuildTasks = [];

				for (const [entryName, entry] of Object.entries(buildConfig.input)) {
					const config = createViteConfig(
						{
							input: {
								[entryName]: path.join(projectPath, `${entry}`),
							},
							outDir: path.join(projectPath, buildConfig.outDir),
						},
						{ emptyOutDir: false },
					);

					entryBuildTasks.push({
						title: `Building ${entryName}`,
						task: async () => {
							const result = await build({
								root: projectPath,
								publicDir: false,
								...config,
								configFile: false,
							});
						},
					});
				}

				console.log('buildConfig', buildConfig);

				return new Listr(entryBuildTasks, { concurrent: true });
			},
		});
	}

	const tasks = new Listr(taskList, { concurrent: true });

	await tasks.run();
}
