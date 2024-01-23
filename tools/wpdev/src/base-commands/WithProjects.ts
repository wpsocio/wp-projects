import { Args, Command, Flags, Interfaces } from '@oclif/core';
import chalk from 'chalk';
import {
	PROJECT_CONFIG_FILE_NAME,
	ROOT_CONFIG_FILE_NAME,
} from '../utils/config.js';
import { WPProject, getStandalonePackage } from '../utils/tools.js';
import { WPMonorepo } from '../utils/wp-monorepo.js';
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
		'<%= config.bin %> <%= command.id %> wptelegram test-theme',
		'<%= config.bin %> <%= command.id %> --all',
	];

	static baseFlags = {
		...WithRootDirAsCwd.baseFlags,
		all: Flags.boolean({
			description: 'Target all projects in monorepo.',
		}),
		'from-changeset': Flags.boolean({
			description: 'Target projects in monorepo from changesets.',
			dependsOn: ['changeset-json'],
		}),
		'changeset-json': Flags.file({
			description:
				'Path to the changeset status JSON file. Pass the {filePath} given to `changset status --output={filePath}`',
			default: '',
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
			const messages = ['Could not find any project.'];

			if (!this.flags.all && this.cliConfig.operationMode === 'wp-monorepo') {
				messages.push('Use --all to target all projects.');
			}

			const expectedConfigFile =
				this.cliConfig.operationMode === 'wp-monorepo'
					? PROJECT_CONFIG_FILE_NAME
					: ROOT_CONFIG_FILE_NAME;

			const expectedPkgJsonConfig =
				this.cliConfig.operationMode === 'wp-monorepo'
					? 'wpdev.belongsTo'
					: 'wpdev.isRoot';

			messages.push(
				`Please ensure to add a "${expectedConfigFile}" file to your project or a "${expectedPkgJsonConfig}" config to package.json.`,
			);
			throw new Error(messages.join('\n'));
		}
	}

	protected projects = new Map<string, WPProject>();

	protected flags!: TFlags<T>;

	protected args!: TArgs<T>;

	protected wpMonorepo!: WPMonorepo;

	protected async setup() {
		const { args, flags, argv } = await this.parse({
			baseFlags: (super.ctor as typeof WithProjects).baseFlags,
			flags: this.ctor.flags,
			args: this.ctor.args,
			strict: this.ctor.strict,
		});

		this.wpMonorepo = new WPMonorepo(this.cliConfig);

		this.flags = flags as TFlags<T>;

		this.args = args as TArgs<T>;

		if (this.cliConfig.operationMode === 'wp-monorepo') {
			if (this.flags['from-changeset']) {
				this.projects = this.wpMonorepo.getProjectsToRelease(
					this.flags['changeset-json'],
				);
			} else if (this.flags.all) {
				this.projects = this.wpMonorepo.getManagedProjects();
			} else if (argv.length) {
				this.projects = this.wpMonorepo.getProjectsByName(
					argv as Array<string>,
				);
			} else {
				await this.detectProject();
			}
		} else {
			await this.detectProject();
		}
	}

	protected async detectProject() {
		const project = await getStandalonePackage(this.commandCwd);

		if (!project) {
			throw new Error('Could not detect project.');
		}

		this.log('🔍 Detected project: ', chalk.bold(project.packageJson.name));

		if (project.packageJson.wpdev?.belongsTo) {
			this.projects = new Map([[project.packageJson.name, project]]);

			return;
		}
	}

	public async init() {
		await super.init();

		try {
			await this.setup();
			this.assertArgs();
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
