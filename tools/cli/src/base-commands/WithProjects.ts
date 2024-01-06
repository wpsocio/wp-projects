import path from 'node:path';
import { Args, Command, Flags, Interfaces } from '@oclif/core';
import chalk from 'chalk';
import { detectProject } from '../utils/projects.js';
import { WPProjects } from '../utils/wp-projects.js';
import { WithRootDirAsCwd } from './WithRootDirAsCwd.js';

export type TFlags<T extends typeof Command> = Interfaces.InferredFlags<
	typeof WithProjects.baseFlags & T['flags']
>;
export type TArgs<T extends typeof Command> = Interfaces.InferredArgs<
	typeof WithProjects.args & T['args']
>;

export abstract class WithProjects<
	T extends typeof Command,
> extends WithRootDirAsCwd {
	static examples = [
		'<%= config.bin %> <%= command.id %>',
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

	// `strict` must be set to `false` by the child class,
	// otherwise it throws an error when multiple args are provided.
	static strict = false;

	protected assertArgs() {
		if (!this.projects.size) {
			throw new Error('Please provide a project. Use --all to target all.');
		}
	}

	protected projects!: Set<string>;

	protected flags!: TFlags<T>;

	protected args!: TArgs<T>;

	protected wpProjects!: WPProjects;

	protected async setup() {
		const { args, flags, argv } = await this.parse({
			baseFlags: (super.ctor as typeof WithProjects).baseFlags,
			flags: this.ctor.flags,
			args: this.ctor.args,
			strict: this.ctor.strict,
		});

		this.wpProjects = new WPProjects(this.devConfig);

		this.flags = flags as TFlags<T>;

		this.args = args as TArgs<T>;

		if (this.devConfig.repoType === 'single') {
			this.projects = new Set(['.']);
		} else {
			if (flags.all) {
				this.projects = this.wpProjects.getMonorepoProjects();
			} else if (argv.length) {
				this.projects = new Set(argv as Array<string>);
			} else {
				const detectedProject = await this.detectProject();

				this.log('🔍 Detected project: ', chalk.bold(detectedProject));

				this.projects = new Set([detectedProject]);
			}
		}
	}

	protected async detectProject() {
		const result = await detectProject({
			startAt: this.actualCwd,
			stopAt: this.devConfig.rootDir,
		});

		if (!result) {
			const messages = ['Could not detect project.'];

			if (this.devConfig.repoType === 'monorepo') {
				messages.push(
					'Please provide a project. Use --all to target all projects.',
				);
			}
			throw new Error(messages.join('\n'));
		}

		return (
			path
				.relative(this.devConfig.rootDir, result.dir)
				// Convert path separators to posix style
				.split(path.sep)
				.join(path.posix.sep)
		);
	}

	protected validateProjects() {
		for (const project of this.projects) {
			this.wpProjects.validateProject(project);
		}
	}

	public async init() {
		await super.init();

		try {
			await this.setup();
			this.assertArgs();
			this.validateProjects();
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
}
