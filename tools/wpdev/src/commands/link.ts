import { Flags } from '@oclif/core';
import chalk from 'chalk';
import { WithProjects } from '../base-commands/WithProjects.js';
import { SymlinkManager } from '../utils/symlinks.js';

export default class Link extends WithProjects<typeof Link> {
	static description =
		'Creates symlinks in the given wp-content directory for the project(s) in this monorepo.';

	static flags = {
		'wp-content-dir': Flags.string({
			char: 'd',
			description: 'Path to the WordPress content directory.',
			env: 'WP_CONTENT_DIR',
			default: '',
		}),
	};

	static args = {
		...WithProjects.args,
	};

	symlinkManager = new SymlinkManager();

	assertArgs() {
		if (!this.flags['wp-content-dir']) {
			throw new Error(
				'Please provide a valid WordPress content directory.\n\nYou can set it using the --wp-content-dir option or the WP_CONTENT_DIR environment variable.',
			);
		}
		super.assertArgs();
	}

	public async run(): Promise<void> {
		try {
			for (const project of this.projects) {
				const symlinkPath = this.wpProjects.getSymlinkPath(
					project,
					this.flags['wp-content-dir'],
				);
				const realPath = this.wpProjects.getRealPath(project);
				const result = this.symlinkManager.createSymlink({
					symlinkPath,
					realPath,
				});

				if (result) {
					this.log(result);
				}
			}
		} catch (error) {
			this.log(chalk.red((error as { message: string }).message));
			process.exitCode = 1;
		}
	}
}
