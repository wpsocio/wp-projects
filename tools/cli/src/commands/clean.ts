import child_process from 'node:child_process';
import fs from 'node:fs';
import { Args, Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import enquirer from 'enquirer';
import { getAllProjects, getProjects } from '../utils/projects.js';

type CleanArgs = {
	path: string;
	include?: string[];
	all?: boolean;
};

export default class Clean extends Command {
	static description = 'Cleans up the given path(s) in this monorepo.';

	static examples = [
		'<%= config.bin %> <%= command.id %> plugins/wptelegram --include=ignored --include=node_modules',
		'<%= config.bin %> <%= command.id %> --all',
	];

	static flags = {
		include: Flags.string({
			char: 'i',
			description: 'Type of files to delete',
			options: ['ignored', 'node_modules', 'composer.lock', 'vendor'],
			multiple: true,
		}),
		all: Flags.boolean({
			description: 'Clean everything',
		}),
	};

	static args = {
		path: Args.string({
			description: 'Path to clean. Relative to root directory',
		}),
	};

	getInput() {
		return this.parse(Clean);
	}

	public async run(): Promise<void> {
		const { args: _args, flags } = await this.getInput();

		const args: CleanArgs = {
			path: _args.path ?? '',
			all: flags.all,
			include: flags.include,
		};

		if (args.all) {
			args.path = '.';
			args.include = ['ignored', 'node_modules', 'composer.lock', 'vendor'];
		} else if (!args.path) {
			args.path = '.';
		}

		try {
			const toDelete = args.include
				? args.include
				: await this.promptForClean(args);

			const allFiles = await this.collectAllFiles(toDelete, args);
			const filesToDelete = this.collectCleanFiles(allFiles, toDelete);

			if (!filesToDelete.length) {
				this.log(chalk.green('No files to delete!'));
				return;
			}

			// Confirm the deletion.
			const runConfirm = await this.confirmRemove(args, filesToDelete);
			if (!runConfirm.confirm) {
				this.log(chalk.red('Cancelling clean up.'));
				return;
			}

			await this.cleanFiles(filesToDelete, args);
		} catch (error) {
			if (
				typeof error === 'object' &&
				error &&
				'message' in error &&
				error.message
			) {
				this.log(chalk.red(error.message));
			}

			process.exitCode = 1;
		}
	}

	async promptForClean(args: CleanArgs) {
		let promptPath = args.path;
		if (args.path === '.' || args.path === 'all') {
			promptPath = 'everywhere';
		} else {
			promptPath = `at ${promptPath}`;
		}
		const response = await enquirer.prompt<{
			toDelete: Array<string>;
		}>([
			{
				type: 'multiselect',
				name: 'toDelete',
				message: `What file types should be deleted ${promptPath}?`,
				choices: [
					{
						message: 'Files ignored by git',
						value: 'ignored',
						name: 'ignored',
					},
					{
						value: 'node_modules',
						name: 'node_modules',
					},
					{
						value: 'composer.lock',
						name: 'composer.lock',
					},
					{
						value: 'vendor',
						name: 'vendor',
					},
				],
			},
		]);

		return response.toDelete;
	}

	async cleanFiles(filesToDelete: Array<string>, args: CleanArgs) {
		console.error(chalk.green('Cleaning files! You may grab a coffee...'));

		for (const file of filesToDelete) {
			try {
				this.log(`Cleaning ${file}`);
				fs.rmSync(file, { recursive: true, force: true });
			} catch (e) {
				console.error(chalk.red((e as { message: string }).message));
				process.exitCode = 1;
				return;
			}
		}

		const nodeModulesDirs = filesToDelete.filter((file) =>
			file.match(/(^|\/)node_modules\/$/),
		);
		if (nodeModulesDirs.length) {
			process.on('exit', () => {
				for (const file of nodeModulesDirs) {
					fs.rmSync(file, { recursive: true, force: true });
				}
			});
		}

		this.log(
			chalk.green(
				`Clean completed! ${
					args.path === '.' ? 'Everything' : args.path
				} cleans up so nicely, doesn't it?`,
			),
		);
	}

	collectCleanFiles(
		allFiles: Record<string, Array<string>>,
		toDelete: Array<string>,
	) {
		let filesToDelete = new Set<string>();
		for (const file of toDelete) {
			switch (file) {
				case 'node_modules':
					filesToDelete = new Set([...filesToDelete, ...allFiles.node_modules]);
					break;
				case 'composer.lock':
					filesToDelete = new Set([...filesToDelete, ...allFiles.composerLock]);
					break;
				case 'vendor':
					filesToDelete = new Set([...filesToDelete, ...allFiles.vendor]);
					break;
				case 'ignored':
					filesToDelete = new Set([...filesToDelete, ...allFiles.other]);
					break;
			}
		}

		// Ensure that node_modules/ at root is deleted last.
		if (filesToDelete.has('node_modules/')) {
			filesToDelete.delete('node_modules/');
			/**
			 * TODO fix this
			 *
			 * Deletion of node_modules/ fails with this error on Windows:
			 *
			 * EPERM: operation not permitted, unlink '.pnpm\@rollup+rollup-win32-x64-msvc@4.9.1\node_modules\@rollup\rollup-win32-x64-msvc\rollup.win32-x64-msvc.node
			 */
			// filesToDelete.add('node_modules/');
		}

		return [...filesToDelete].filter(Boolean);
	}

	async collectAllFiles(toDelete: Array<string>, args: CleanArgs) {
		const allFiles: Record<string, Array<string>> = {
			node_modules: [],
			vendor: [],
			composerLock: [],
			other: [],
		};

		const ignoredFiles = child_process.execSync(
			`git -c core.quotepath=off ls-files ${args.path} --exclude-standard --directory --ignored --other`,
		);

		const ignoredFileNames = ignoredFiles.toString().trim().split('\n');

		// If we want to clean up a checked in composer.lock file, ls-files won't work and we have to filter the files manually.
		if (toDelete.includes('composer.lock')) {
			const files = child_process.execSync(
				'git -c core.quotepath=off ls-files **/*/composer.lock',
			);
			const composerLockFiles = files.toString().trim().split('\n');

			allFiles.composerLock.push(...composerLockFiles);
		}

		// It's possible that the connected project may be a git repo
		// So the above git commands won't work for nested git repos
		const connectedProjects = getProjects({ connected: true });

		for (const project of connectedProjects) {
			const files = child_process.execSync(
				`git -C ${project} -c core.quotepath=off ls-files --exclude-standard --directory --ignored --other`,
			);
			const connectedProjectFiles = files
				.toString()
				.trim()
				.split('\n')
				.map((file) => `${project}/${file}`);

			ignoredFileNames.push(...connectedProjectFiles);

			if (
				toDelete.includes('composer.lock') &&
				fs.existsSync(`${project}/composer.lock`)
			) {
				allFiles.composerLock.push(`${project}/composer.lock`);
			}
		}

		// We do not want to delete any of the project directories in the monorepo.
		const filesToSkip = new Set(
			[...getAllProjects()].map((project) =>
				// Ensure that the path ends with a slash.
				project.replace(/\/?$/, '/'),
			),
		);

		for (const file of ignoredFileNames) {
			if (filesToSkip.has(file) || file.endsWith('.env')) {
				continue;
			}
			if (file.match(/(^|\/)node_modules\/$/)) {
				allFiles.node_modules.push(file);
			} else if (file.match(/(^|\/)vendor\/$/)) {
				allFiles.vendor.push(file);
			} else if (file.match(/(^|\/)composer\.lock$/)) {
				allFiles.composerLock.push(file);
			} else {
				allFiles.other.push(file);
			}
		}

		return allFiles;
	}

	async confirmRemove(args: CleanArgs, filesToDelete: Array<string>) {
		for (const file of filesToDelete) {
			this.log(file);
		}

		let confirmMessage = 'Okay to delete the above files/folders?';

		if (args.all) {
			confirmMessage =
				'You want to nuke everything? (node_modules, vendor, and git-ignored files?)';
		}

		const response = await enquirer.prompt<{ confirm: boolean }>({
			type: 'confirm',
			name: 'confirm',
			message: chalk.green(confirmMessage),
			initial: true,
		});

		return response;
	}
}
