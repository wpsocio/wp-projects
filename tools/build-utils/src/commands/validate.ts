import fs from 'node:fs';
import { getPackagesSync } from '@manypkg/get-packages';
import { Command } from '@oclif/core';
import chalk from 'chalk';
import { schema } from '../utils/validate.js';

export default class Validate extends Command {
	static description = 'Validates build output files.';

	public async run(): Promise<void> {
		try {
			this.log('Validating build output files...');

			const { packages } = getPackagesSync(process.cwd());

			const pkg = packages.find((pkg) => pkg.dir === process.cwd());

			if (!pkg) {
				this.error('No package.json found at current directory');
			}

			if ('build-utils' in pkg.packageJson && pkg.packageJson['build-utils']) {
				const { validate: toValidate } = schema.parse(
					pkg.packageJson['build-utils'],
				);

				for (const { paths, rules } of toValidate) {
					for (const path of paths) {
						for (const { value, message } of rules) {
							let errorMessage = '';

							switch (value) {
								case 'EXISTS':
								case 'NOT_EXISTS': {
									const exists = fs.existsSync(path);

									if (value === 'EXISTS' && !exists) {
										errorMessage = message || `File "{path}" does not exist`;
									} else if (value === 'NOT_EXISTS' && exists) {
										errorMessage = message || `File "{path}" should not exist`;
									}
									break;
								}
							}

							if (errorMessage) {
								this.error(
									chalk.red(errorMessage.replace('{path}', `"${path}"`)),
								);
							}
						}
					}
				}
			} else {
				this.error(
					`No "build-utils" configuration found in package.json at "${process.cwd()}"`,
				);
			}
		} catch (error) {
			this.log(chalk.red((error as { message: string }).message));
			process.exitCode = 1;
		}
	}
}
