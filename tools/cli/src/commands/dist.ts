import { Args, Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import {
	getMonorepoProjects,
	normalizeProjectsInput,
	validateProject,
} from '../utils/projects.js';

export default class Dist extends Command {
	static description = 'Prepares projects for distribution or deployment.';

	static examples = [
		'<%= config.bin %> <%= command.id %> plugins/wptelegram,themes/wptest',
		'<%= config.bin %> <%= command.id %> --all',
	];

	static flags = {
		'out-dir': Flags.string({
			char: 'd',
			description:
				'Path to the output directory. Defaults to "dist/{project}".',
		}),
		all: Flags.boolean({
			description: 'Prepare all projects for distribution.',
		}),
	};

	static strict = false;

	static args = {
		projects: Args.string({
			description: 'Project(s) to prepare for distribution.',
		}),
	};

	getInput() {
		return this.parse(Dist);
	}

	assertArgs(
		args: Awaited<ReturnType<typeof this.getInput>>['args'],
		flags: Awaited<ReturnType<typeof this.getInput>>['flags'],
	): asserts flags is {
		'out-dir': string;
		all: boolean;
		json: boolean;
	} {
		if (!args.projects?.length && !flags.all) {
			throw new Error('Please provide a project.');
		}
	}

	public async run(): Promise<void> {
		const { args, flags, raw } = await this.getInput();

		try {
			this.assertArgs(args, flags);

			const projects = flags.all
				? getMonorepoProjects()
				: normalizeProjectsInput(raw);

			for (const project of projects) {
				validateProject(project);
			}

			for (const project of projects) {
				const result = 'test';

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
