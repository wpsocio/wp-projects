import { Flags } from '@oclif/core';
import chalk from 'chalk';
import { BaseProjectCommand } from '../baseProjectCommand.js';

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
		console.log(this);

		try {
			for (const project of this.projects) {
				const result = project;

				if (result) {
					this.log(result);
				}
			}
		} catch (error) {
			this.log(chalk.red((error as { message: string }).message));
			process.exitCode = 1;
		}
	}

	async prepareForDist(project: string) {}
}
