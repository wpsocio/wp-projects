import chalk from 'chalk';
import { Argv, CommandModule } from 'yargs';
import { InferBuilderOptions } from '../types.js';
import {
	getAllProjects,
	getRealPath,
	getSymlinkPath,
	validateProject,
} from '../utils/projects.js';
import { SymlinkManager } from '../utils/symlinks.js';

const WP_CONTENT_DIR = process.env.WP_CONTENT_DIR;

function createBuilder(action: 'link' | 'unlink') {
	return function builder(yargs: Argv) {
		return yargs
			.positional('projects', {
				describe: `Project(s) to ${action}, e.g. plugins/wptelegram, themes/wptest.`,
				type: 'string',
				// array: true, Array option works weirdly with positional arguments
				// in order to provide support for comma separated values, we need to use coerce
				coerce(projects: Array<string>) {
					// Comma gets converted to space by yargs
					return projects
						.flatMap((project) => project.split(/\s+/))
						.map((part) => part.trim())
						.filter(Boolean);
				},
			})
			.option('wp-content-dir', {
				describe: 'Path to the WordPress content directory.',
				type: 'string',
				default: WP_CONTENT_DIR,
			})
			.option('all', {
				describe: `${
					action.charAt(0).toUpperCase() + action.slice(1)
				} all projects.`,
				type: 'boolean',
			});
	};
}

export type LinkArgs = InferBuilderOptions<
	ReturnType<ReturnType<typeof createBuilder>>
>;

function assertArgs(
	args: LinkArgs,
): asserts args is LinkArgs & { wpContentDir: string } {
	if (!args['wp-content-dir']) {
		console.log(
			chalk.red('Please provide a valid WordPress content directory.'),
		);
		console.log(
			chalk(
				'You can set it using the --wp-content-dir option or the WP_CONTENT_DIR environment variable.',
			),
		);

		process.exit(1);
	}

	if (!args.projects?.length && !args.all) {
		console.log(chalk.red('Please provide a project.'));

		process.exit(1);
	}
}

export function createLinkCommand(): CommandModule<unknown, LinkArgs> {
	return {
		command: 'link [projects...]',
		describe:
			'Creates symlinks in the given wp-content directory for the project(s) in this monorepo.',
		builder: createBuilder('link'),
		async handler(argv) {
			assertArgs(argv);

			const symlinkManager = new SymlinkManager();

			const projects = new Set(argv.all ? getAllProjects() : argv.projects);

			for (const project of projects) {
				validateProject(project);
			}

			for (const project of projects) {
				const symlinkPath = getSymlinkPath(project, argv.wpContentDir);
				const realPath = getRealPath(project);
				const result = symlinkManager.createSymlink({ symlinkPath, realPath });

				if (result) {
					console.log(result);
				}
			}
		},
	};
}

export function createUnlinkCommand(): CommandModule<unknown, LinkArgs> {
	return {
		command: 'unlink [projects...]',
		describe:
			'Removes symlinks in the given wp-content directory created for the project(s) in this monorepo.',
		builder: createBuilder('unlink'),
		async handler(argv) {
			assertArgs(argv);

			const symlinkManager = new SymlinkManager();

			const projects = new Set(argv.all ? getAllProjects() : argv.projects);

			for (const project of projects) {
				validateProject(project);
			}

			if (argv.all) {
				symlinkManager.setMessages({
					linkDoesNotExist: '',
				});
			}

			for (const project of projects) {
				const symlinkPath = getSymlinkPath(project, argv.wpContentDir);

				const result = symlinkManager.removeSymlink({ symlinkPath });

				if (result) {
					console.log(result);
				}
			}
		},
	};
}
