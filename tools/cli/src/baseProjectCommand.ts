import { Args, Command, Flags, Interfaces } from '@oclif/core';
import type { ParsingToken } from '@oclif/core/lib/interfaces/parser.js';
import chalk from 'chalk';
import { getMonorepoProjects, validateProject } from './utils/projects.js';

export type TFlags<T extends typeof Command> = Interfaces.InferredFlags<
	typeof BaseProjectCommand.baseFlags & T['flags']
>;
export type TArgs<T extends typeof Command> = Interfaces.InferredArgs<
	typeof BaseProjectCommand.args & T['args']
>;

export abstract class BaseProjectCommand<
	T extends typeof Command,
> extends Command {
	static examples = [
		'<%= config.bin %> <%= command.id %> plugins/wptelegram themes/wptest',
		'<%= config.bin %> <%= command.id %> --all',
	];

	static baseFlags = {
		all: Flags.boolean({
			description: 'Target all projects.',
		}),
	};

	static args = {
		projects: Args.string({
			description: 'Project(s) to target.',
		}),
	};

	static strict = false;

	protected assertArgs() {
		if (!this.args.projects?.length && !this.flags.all) {
			throw new Error('Please provide a project. Use --all to target all.');
		}
	}

	protected projects!: Set<string>;

	protected flags!: TFlags<T>;

	protected args!: TArgs<T>;

	protected normalizeProjectsInput(rawInput: Array<ParsingToken>) {
		const projects = [];

		for (const token of rawInput) {
			if (token.type === 'arg') {
				projects.push(
					...token.input
						.split(/\s+/)
						.map((project) => project.trim())
						.filter(Boolean),
				);
			}
		}

		return new Set(projects);
	}

	protected validateProjects() {
		for (const project of this.projects) {
			validateProject(project);
		}
	}

	public async init(): Promise<void> {
		await super.init();
		const { args, flags, raw } = await this.parse({
			baseFlags: (super.ctor as typeof BaseProjectCommand).baseFlags,
			flags: this.ctor.flags,
			args: this.ctor.args,
			strict: this.ctor.strict,
		});

		this.flags = flags as TFlags<T>;
		this.args = args as TArgs<T>;

		this.projects = flags.all
			? getMonorepoProjects()
			: this.normalizeProjectsInput(raw);

		try {
			this.assertArgs();
			this.validateProjects();
		} catch (error) {
			if (
				typeof error === 'object' &&
				error &&
				'message' in error &&
				error.message
			) {
				this.log(chalk.red(error.message));
			}
			this.exit(1);
		}
	}
}
