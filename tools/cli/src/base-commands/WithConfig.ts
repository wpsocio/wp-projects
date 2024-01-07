import fs from 'node:fs';
import path from 'node:path';
import { Command } from '@oclif/core';
import chalk from 'chalk';
import dotenv from 'dotenv';
import { findUp, pathExists } from 'find-up';
import parseJson from 'parse-json';
import { readPackage } from 'read-pkg';
import { z } from 'zod';
import type { Config } from '../utils/wp-projects.js';

export const UserConfigSchema = z
	.object({
		envFiles: z.array(z.string()).optional().default([]),
		repoType: z.enum(['monorepo', 'single']).optional().default('monorepo'),
		projectTypes: z.array(z.string()).optional().default([]),
	})
	.transform((value) => {
		if (value.repoType === 'single') {
			// 'projectTypes' is not used in single repo mode
			return {
				...value,
				projectTypes: [],
			};
		}

		// If we already have project types, return the value as is
		if (value.projectTypes.length) {
			return value;
		}

		// Otherwise, default to plugins and themes
		return {
			...value,
			projectTypes: ['plugins', 'themes'],
		};
	});

export type DevConfig = Config;

export abstract class WithConfig extends Command {
	protected devConfig!: DevConfig;

	public async init() {
		await super.init();

		const configFile = await findUp(['wpdev.config.json']);

		let userConfig: unknown;

		let rootDir: string | undefined;

		if (!configFile) {
			rootDir = await findUp(
				async (directory) => {
					const pkg = path.join(directory, 'package.json');
					const hasPkg = await pathExists(pkg);

					if (hasPkg) {
						const { wpdev } = await readPackage({ cwd: directory });

						if (wpdev) {
							userConfig = wpdev;
							return directory;
						}
					}
				},
				{ type: 'directory' },
			);
		} else {
			rootDir = path.dirname(configFile);
			userConfig = parseJson(fs.readFileSync(configFile, 'utf-8'));
		}

		if (!rootDir || !userConfig) {
			this.log(
				chalk.red(
					'Could not find wpdev config file or a corresponding package.json entry.',
				),
			);
			this.exit(1);
		}

		const parsedUserConfig = UserConfigSchema.safeParse(userConfig);

		if (!parsedUserConfig.success) {
			this.log(chalk.red('Invalid wpdev config.'));
			this.log(
				`Errors: ${JSON.stringify(
					parsedUserConfig.error.flatten().fieldErrors,
					null,
					2,
				)}`,
			);
			this.exit(1);
		}

		const { envFiles, ...devConfig } = parsedUserConfig.data;

		for (const envFile of parsedUserConfig.data.envFiles) {
			const envFilePath = path.join(rootDir, envFile);

			if (await pathExists(envFilePath)) {
				dotenv.config({
					path: envFilePath,
				});
			}
		}

		this.devConfig = {
			rootDir,
			...devConfig,
		};
	}
}
