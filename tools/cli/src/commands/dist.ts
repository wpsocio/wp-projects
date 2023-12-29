import { Flags } from '@oclif/core';
import chalk from 'chalk';
import { Listr, ListrTask, delay } from 'listr2';
import { BaseProjectCommand } from '../baseProjectCommand.js';
import { updateRequirements } from '../utils/dist.js';

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
		const tasksList: Array<ListrTask> = [];

		for (const project of this.projects) {
			tasksList.push({
				title: `Preparing ${project}`,
				task: () => {
					return this.prepareForDist(project);
				},
			});
		}

		const tasks = new Listr(tasksList, {
			concurrent: true,
		});

		try {
			await tasks.run();
		} catch (error) {
			this.log(chalk.red((error as { message: string }).message));
			process.exitCode = 1;
		}
	}

	async prepareForDist(project: string) {
		const projectTasksList: Array<ListrTask> = [
			{
				title: 'Update requirements',
				task: async (): Promise<void> => {
					await updateRequirements(project, {
						requirements: {
							requiresPHP: '8.3',
							requiresAtLeast: '5.9',
							testedUpTo: '6.1',
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
				task: async (): Promise<void> => {},
			},
		];

		return new Listr(projectTasksList, { concurrent: false });
	}
}
