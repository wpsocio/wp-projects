import { Args, Flags } from '@oclif/core';
import chalk from 'chalk';
import {
	getMonorepoProjects,
	getSymlinkPath,
	normalizeProjectsInput,
	validateProject,
} from '../utils/projects.js';
import { SymlinkManager } from '../utils/symlinks.js';
import Link from './link.js';

export default class Unlink extends Link {
	static description =
		'Removes symlinks in the given wp-content directory created for the project(s) in this monorepo.';

	static flags = {
		...Link.flags,
		all: Flags.boolean({
			description: 'Unlink all projects.',
		}),
	};

	static args = {
		...Link.args,
		projects: Args.string({
			description: 'Project(s) to unlink',
		}),
	};

	static strict = false;

	getInput() {
		return this.parse(Unlink);
	}

	public async run(): Promise<void> {
		const { args, flags, raw } = await this.getInput();

		try {
			this.assertArgs(args, flags);

			const symlinkManager = new SymlinkManager();

			const projects = flags.all
				? getMonorepoProjects()
				: normalizeProjectsInput(raw);

			for (const project of projects) {
				validateProject(project);
			}

			if (flags.all) {
				symlinkManager.setMessages({
					linkDoesNotExist: '',
				});
			}

			for (const project of projects) {
				const symlinkPath = getSymlinkPath(project, flags['wp-content-dir']);

				const result = symlinkManager.removeSymlink({ symlinkPath });

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
