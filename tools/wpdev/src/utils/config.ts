import fs from 'node:fs';
import path from 'node:path';
import { findUp, pathExists } from 'find-up';
import parseJson from 'parse-json';
import { UserConfig, UserConfigSchema, getStandalonePackage } from './tools.js';

export type ParsedUserConfig = Omit<UserConfig, 'isRoot'> & {
	rootDir: string;
};

export const ROOT_CONFIG_FILE_NAME = 'wpdev.config.json';
export const PROJECT_CONFIG_FILE_NAME = 'wpdev.project.js';

export async function parseUserConfig(
	_rootDir?: string,
): Promise<ParsedUserConfig> {
	let userConfig: unknown;

	let rootDir = _rootDir;

	// If rootDir is provided as an argument, we don't need to find it.
	if (rootDir) {
		const configFile = path.join(rootDir, ROOT_CONFIG_FILE_NAME);

		const hasConfigFile = await pathExists(configFile);
		const hasPackageJson = await pathExists(path.join(rootDir, 'package.json'));

		if (hasConfigFile) {
			userConfig = parseJson(fs.readFileSync(configFile, 'utf-8'));
		} else if (hasPackageJson) {
			const { packageJson } = await getStandalonePackage(rootDir);

			if (packageJson.wpdev?.isRoot) {
				userConfig = packageJson.wpdev;
			}
		}
	} else {
		const configFile = await findUp([ROOT_CONFIG_FILE_NAME]);

		if (!configFile) {
			rootDir = await findUp(
				async (directory) => {
					const pkg = path.join(directory, 'package.json');
					const hasPkg = await pathExists(pkg);

					if (hasPkg) {
						const { packageJson } = await getStandalonePackage(directory);

						if (packageJson.wpdev?.isRoot) {
							userConfig = packageJson.wpdev;
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
	}

	if (!rootDir) {
		throw new Error(
			'Could not find wpdev config file or a corresponding package.json entry.',
		);
	}

	const parsedUserConfig = UserConfigSchema.safeParse(userConfig || {});

	if (!parsedUserConfig.success) {
		throw new Error(
			`Invalid wpdev config.\nErrors: ${JSON.stringify(
				parsedUserConfig.error.flatten().fieldErrors,
				null,
				2,
			)}`,
		);
	}

	return { rootDir, ...parsedUserConfig.data };
}
