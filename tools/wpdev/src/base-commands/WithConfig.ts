import path from 'node:path';
import { Command, Flags } from '@oclif/core';
import dotenv from 'dotenv';
import { pathExists } from 'find-up';
import { ParsedUserConfig, parseUserConfig } from '../utils/config.js';
import { UserConfig } from '../utils/tools.js';

export type CliConfig = Omit<UserConfig, 'isRoot' | 'envFiles'> & {
	rootDir: string;
};

export abstract class WithConfig extends Command {
	static baseFlags = {
		'root-dir': Flags.string({
			description: 'Root directory. Can be an absolute or a relative path.',
			char: 'r',
		}),
		'operation-mode': Flags.option({
			description: 'Operation mode.',
			char: 'm',
			options: ['wp-monorepo', 'standalone'] as const,
		})(),
		'project-types': Flags.option({
			description:
				'Project types managed in the monorepo. Only used in wp-monorepo mode.',
			char: 't',
			options: ['plugins', 'themes'] as const,
			multiple: true,
		})(),
		'env-file': Flags.string({
			description: 'Environment file(s) to load',
			char: 'e',
			multiple: true,
		}),
	};

	protected cliConfig!: CliConfig;

	async flagsToConfig(): Promise<Partial<ParsedUserConfig>> {
		const { flags } = await this.parse({
			baseFlags: (super.ctor as typeof WithConfig).baseFlags,
			flags: this.ctor.flags,
			args: this.ctor.args,
			strict: this.ctor.strict,
		});

		let config = {
			rootDir: flags['root-dir'],
			operationMode: flags['operation-mode'],
			projectTypes: flags['project-types'],
			envFiles: flags['env-file'],
		};

		// Remove undefined values
		config = JSON.parse(JSON.stringify(config));

		if (config.rootDir) {
			config.rootDir = path.resolve(config.rootDir);
		}

		return config;
	}

	public async init() {
		await super.init();

		const cliFlags = await this.flagsToConfig();
		const parsedConfig = await parseUserConfig(cliFlags.rootDir);

		const { envFiles, ...config } = {
			...parsedConfig,
			...cliFlags,
		};

		for (const envFile of envFiles) {
			const envFilePath = path.join(config.rootDir, envFile);

			if (await pathExists(envFilePath)) {
				dotenv.config({
					path: envFilePath,
				});
			}
		}

		this.cliConfig = config;
	}
}
