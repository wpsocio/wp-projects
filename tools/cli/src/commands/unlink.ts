import chalk from 'chalk';
import { getSymlinkPath } from '../utils/projects.js';
import Link from './link.js';

export default class Unlink extends Link {
	static description =
		'Removes symlinks in the given wp-content directory created for the project(s) in this monorepo.';

	public async run(): Promise<void> {
		try {
			if (this.flags.all) {
				this.symlinkManager.setMessages({
					linkDoesNotExist: '',
				});
			}

			for (const project of this.projects) {
				const symlinkPath = getSymlinkPath(
					project,
					this.flags['wp-content-dir'],
				);

				const result = this.symlinkManager.removeSymlink({ symlinkPath });

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
