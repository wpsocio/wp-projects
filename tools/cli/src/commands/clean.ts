/**
 * Parts of this file are copied from the Jetpack CLI.
 */
import child_process from 'node:child_process';
import fs from 'node:fs';
import chalk from 'chalk';
import enquirer from 'enquirer';
import { Argv } from 'yargs';
import { InferBuilderOptions } from '../types.js';
import { getAllProjects, getProjects } from '../utils/projects.js';

export const command = 'clean [path] [include]';

export const describe = 'Cleans up the given path(s) in this monorepo.';

export function builder(yargs: Argv) {
	return yargs
		.positional('path', {
			describe: 'Path to clean. Relative to root directory, or "all"',
			type: 'string',
		})
		.array('include')
		.positional('include', {
			alias: 'i',
			describe: 'Type of files to delete',
			choices: ['ignored', 'node_modules', 'composer.lock', 'vendor'],
			// array: true, Array option works weirdly with positional arguments
			// in order to provide support for comma separated values, we need to use coerce
			coerce(fileTypes: Array<string>) {
				// Comma gets converted to space by yargs
				return fileTypes
					.flatMap((fileType) => fileType.split(/\s+/))
					.map((part) => part.trim())
					.filter(Boolean);
			},
		})
		.option('all', {
			alias: 'a',
			type: 'boolean',
			description: 'Clean everything',
		});
}

type HandlerArgs = InferBuilderOptions<ReturnType<typeof builder>>;

export async function handler(argv: HandlerArgs) {
	if (argv.all) {
		argv.path = '.';
		argv.include = ['ignored', 'node_modules', 'composer.lock', 'vendor'];
	} else if (!argv.path) {
		argv.path = '.';
	}

	const toDelete = argv.include ? argv.include : await promptForClean(argv);

	const allFiles = await collectAllFiles(toDelete, argv);
	const filesToDelete = collectCleanFiles(allFiles, toDelete);

	if (!filesToDelete.length) {
		console.log(chalk.green('No files to delete!'));
		return;
	}

	// Confirm the deletion.
	const runConfirm = await confirmRemove(argv, filesToDelete);
	if (!runConfirm.confirm) {
		console.log(chalk.red('Cancelling clean up.'));
		return;
	}

	await cleanFiles(filesToDelete, argv);
}

async function cleanFiles(filesToDelete: Array<string>, argv: HandlerArgs) {
	console.error(chalk.green('Cleaning files! You may grab a coffee...'));

	for (const file of filesToDelete) {
		console.log(`Cleaning ${file}`);
		try {
			fs.rmSync(file, { recursive: true, force: true });
		} catch (e) {
			console.error(chalk.red((e as { message: string }).message));
			process.exit(1);
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

	console.log(
		chalk.green(
			`Clean completed! ${
				argv.path === '.' ? 'Everything' : argv.path
			} cleans up so nicely, doesn't it?`,
		),
	);
}

function collectCleanFiles(
	allFiles: Record<string, Array<string>>,
	toDelete: Array<string>,
) {
	const filesToDelete = [];
	for (const file of toDelete) {
		switch (file) {
			case 'node_modules':
				filesToDelete.push(...allFiles.node_modules);
				break;
			case 'composer.lock':
				filesToDelete.push(...allFiles.composerLock);
				break;
			case 'vendor':
				filesToDelete.push(...allFiles.vendor);
				break;
			case 'ignored':
				filesToDelete.push(...allFiles.other);
				break;
		}
	}

	return filesToDelete.filter(Boolean);
}

async function collectAllFiles(toDelete: Array<string>, argv: HandlerArgs) {
	const allFiles: Record<string, Array<string>> = {
		node_modules: [],
		vendor: [],
		composerLock: [],
		other: [],
	};

	const ignoredFiles = child_process.execSync(
		`git -c core.quotepath=off ls-files ${argv.path} --exclude-standard --directory --ignored --other`,
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

async function confirmRemove(argv: HandlerArgs, filesToDelete: Array<string>) {
	for (const file of filesToDelete) {
		console.log(file);
	}

	let confirmMessage = 'Okay to delete the above files/folders?';

	if (argv.all) {
		confirmMessage =
			'You everything? (node_modules, vendor, and git-ignored files?)';
	}
	const response = await enquirer.prompt<{ confirm: boolean }>({
		type: 'confirm',
		name: 'confirm',
		message: chalk.green(confirmMessage),
		initial: true,
	});

	return response;
}

export async function promptForClean(argv: HandlerArgs) {
	let promptPath = argv.path;
	if (argv.path === '.' || argv.path === 'all') {
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
