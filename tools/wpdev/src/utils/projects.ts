import fs from 'node:fs';
import path from 'node:path';
import { execa } from 'execa';
import { findUp } from 'find-up';
import { readPackageSync } from 'read-pkg';
import { ReleaseType, inc as semverInc } from 'semver';
import { isFileReadable } from './misc.js';
import {
	BundleConfigInput,
	ProjectInfoInput,
	bundleSchema,
	projectInfoSchema,
} from './schema.js';
import { getFileData, zippedFileHeaders } from './wp-files.js';
import { ProjectType } from './wp-projects.js';

export function readPackageJson(cwd: string) {
	return readPackageSync({ cwd });
}

export function getCurrentVersion(cwd: string) {
	return readPackageJson(cwd).version;
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

export type ProjectConfig = {
	getProjectInfo?: (options: {
		projectDir: string;
		version?: string;
	}) => ProjectInfoInput;
	getBundleConfig: (options: {
		projectDir: string;
		slug: string;
		key: string;
		version?: string;
		textDomain: string;
	}) => BundleConfigInput;
};

export async function getProjectConfig(projectDir: string, version?: string) {
	const configPathRel = path.join(projectDir, 'wpdev.project.js');

	const configPath = path.resolve(configPathRel);

	if (!fs.existsSync(configPath)) {
		throw new Error(`Project config file not found at "${configPathRel}"`);
	}

	const { getProjectInfo, getBundleConfig } = (await import(
		`file:///${configPath}`
	)) as ProjectConfig;

	if (!getBundleConfig || typeof getBundleConfig !== 'function') {
		throw new Error(
			`Invalid project config at "${configPathRel}".\n\nERRORS: "getBundleConfig" must be a function.`,
		);
	}

	const projectInfo = getProjectInfo?.({ projectDir, version }) || {};

	const projectInfoResult = projectInfoSchema.safeParse(projectInfo);

	if (!projectInfoResult.success) {
		throw new Error(
			`Invalid project config at "${configPathRel}".\n\nERRORS: "${projectInfoResult.error.message}"`,
		);
	}

	let { slug, key, textDomain } = projectInfoResult.data;

	if (!slug) {
		// If the slug is not defined, use the package name
		// It can be something like "@wpsocio/plugin-name"
		const parts = readPackageJson(projectDir).name.split('/');

		slug = parts[1] || parts[0];
	}

	if (!key) {
		// If the key is not defined, use the slug
		key = slug.replace('-', '_');
	}

	textDomain = textDomain || slug;

	const bundleResult = bundleSchema.safeParse(
		getBundleConfig({ projectDir, slug, key, version, textDomain }),
	);

	if (!bundleResult.success) {
		throw new Error(
			`Invalid project config at "${configPathRel}".\n\nERRORS: "${bundleResult.error.message}"`,
		);
	}

	return {
		projectInfo: { ...projectInfo, slug, key, textDomain },
		bundle: bundleResult.data,
	};
}
