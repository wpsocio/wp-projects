import chalk from 'chalk';
import { Argv, CommandModule } from 'yargs';
import { InferBuilderOptions } from '../types.js';
import {
	getAllProjects,
	getRealPath,
	getSymlinkPath,
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

function assertWpContentDir(
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
}

export function createLinkCommand(): CommandModule<unknown, LinkArgs> {
	return {
		command: 'link [projects...]',
		describe: 'Creates symlink for project(s).',
		builder: createBuilder('link'),
		async handler(argv) {
			assertWpContentDir(argv);

			const symlinkManager = new SymlinkManager();

			if (argv.all) {
				argv.projects = getAllProjects();
			}

			for (const project of new Set(argv.projects)) {
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
		describe: 'Unlinks project(s).',
		builder: createBuilder('unlink'),
		async handler(argv) {
			assertWpContentDir(argv);

			const symlinkManager = new SymlinkManager();

			if (argv.all) {
				argv.projects = getAllProjects();

				symlinkManager.setMessages({
					linkDoesNotExist: '',
				});
			}

			for (const project of new Set(argv.projects)) {
				const symlinkPath = getSymlinkPath(project, argv.wpContentDir);

				const result = symlinkManager.removeSymlink({ symlinkPath });

				if (result) {
					console.log(result);
				}
			}
		},
	};
}
