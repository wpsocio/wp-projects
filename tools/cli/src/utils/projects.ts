import fs from 'node:fs';
import path from 'node:path';
import { execa } from 'execa';
import { findUp } from 'find-up';
import { ReleaseType, inc as semverInc } from 'semver';
import { isFileReadable } from './misc.js';
import { getFileData, zippedFileHeaders } from './wp-files.js';
import { ProjectType } from './wp-projects.js';

export function getCurrentVersion(cwd: string) {
	const packageJsonPath = path.join(cwd, 'package.json');

	const { version } = JSON.parse(
		fs.readFileSync(packageJsonPath, { encoding: 'utf8' }),
	);

	return version;
}

export function getNextVersion(cwd: string, releaseType: string) {
	const currentVersion = getCurrentVersion(cwd);

	return semverInc(currentVersion, releaseType as ReleaseType);
}

export async function runScript(cwd: string, script: string, pm = 'npm') {
	const cleanScript = script.replaceAll('&', '');

	return await execa(pm, ['run', cleanScript], { cwd });
}

/**
 * Detect project from a given path. It traverses the directory tree upwards
 */
export async function detectProject({
	startAt: cwd,
	stopAt,
}: { startAt: string; stopAt: string }) {
	let projectType: ProjectType | undefined;

	const projectDir = await findUp(
		async (directory) => {
			const entries = fs.readdirSync(directory, { withFileTypes: true });

			for (const dirent of entries) {
				if (!dirent.isFile()) {
					continue;
				}

				const file = path.join(directory, dirent.name);

				if (!isFileReadable(file)) {
					return undefined;
				}

				const fileInfo = path.parse(file);

				if (fileInfo.ext === '.css' && fileInfo.name === 'style') {
					const data = await getFileData(file, zippedFileHeaders('theme'));

					// If the file has a theme name, it's a theme
					if (data['Theme Name']) {
						projectType = 'themes';

						return directory;
					}
				}

				if (fileInfo.ext === '.php') {
					const data = await getFileData(file, zippedFileHeaders('plugin'));

					// If the file has a plugin name, it's a plugin
					if (data['Plugin Name']) {
						projectType = 'plugins';

						// But, if there is a dev.php file in the parent directory, use that instead
						const devFile = path.join(fileInfo.dir, 'dev.php');

						if (isFileReadable(devFile)) {
							return fileInfo.dir;
						}

						return directory;
					}
				}
			}
		},
		{ type: 'directory', cwd, stopAt },
	);

	if (!projectDir) {
		return undefined;
	}

	return { dir: projectDir, projectType };
}
