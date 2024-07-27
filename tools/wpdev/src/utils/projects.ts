import fs from 'node:fs';
import path from 'node:path';
import type { Package } from '@manypkg/tools';
import { execa } from 'execa';
import { type ReleaseType, inc as semverInc } from 'semver';
import { PROJECT_CONFIG_FILE_NAME } from './config.js';
import { isFileReadable } from './misc.js';
import {
	type BundleConfigInput,
	type ProjectInfo,
	type ProjectInfoInput,
	bundleSchema,
	projectInfoSchema,
} from './schema.js';
import {
	type UserConfig,
	fixPackageType,
	getStandalonePackage,
} from './tools.js';
import { getFileData, zippedFileHeaders } from './wp-files.js';

export type ProjectType = NonNullable<UserConfig['projectType']>;

export type WPProject = Package & {
	wpdev: ProjectInfo;
};

export function getNextVersion(project: WPProject, releaseType: string) {
	return semverInc(project.packageJson.version, releaseType as ReleaseType);
}

export async function runScript(cwd: string, script: string, pm = 'npm') {
	const cleanScript = script.replaceAll('&', '');

	return await execa(pm, ['run', cleanScript], { cwd });
}

export type ProjectConfig = {
	getProjectInfo?: (project: Package) => ProjectInfoInput;
	getBundleConfig: (
		options: Required<ProjectInfoInput> & {
			project: WPProject;
			version: string;
		},
	) => BundleConfigInput;
};

export function pluralizeProjectType(projectType: ProjectType) {
	return `${projectType}s` as const;
}

export function singularizeProjectType(
	projectType: UserConfig['projectTypes'][number],
) {
	return projectType.replace(/s$/, '') as ProjectType;
}

/**
 * Get the project type e.g. "plugin", "theme", "mu-plugin"
 */
export async function getProjectType(
	_pkg: Package,
	allowedTypes: UserConfig['projectTypes'],
) {
	const pkg = fixPackageType(_pkg);
	// If the project type is defined in the package.json
	if (
		pkg.packageJson.wpdev?.projectType &&
		allowedTypes.includes(
			pluralizeProjectType(pkg.packageJson.wpdev?.projectType),
		)
	) {
		return pkg.packageJson.wpdev.projectType;
	}

	/**
	 * If you do not want to the projects to be detected automatically,
	 * you can set the `WPDEV_DETECT_TYPE_FROM_PARENT_DIR` env var to `false`
	 */
	if (process.env.WPDEV_DETECT_TYPE_FROM_PARENT_DIR !== 'false') {
		// If "projectType" is not defined in package.json,
		// we can use the package's parent folder name to determine the project type
		// For example `relativeDir: 'plugins/wptelegram-widget'`
		const parentDir = path.basename(
			path.dirname(pkg.dir),
		) as UserConfig['projectTypes'][number];

		if (allowedTypes.includes(parentDir)) {
			return singularizeProjectType(parentDir);
		}
	}
}

export async function getProjectInfo(
	project: Package,
	projectTypes: UserConfig['projectTypes'] = [],
) {
	const configPath = path.join(project.dir, PROJECT_CONFIG_FILE_NAME);
	const configPathRel = path.relative(process.cwd(), configPath);

	let details = {
		slug: '',
		key: '',
		textDomain: '',
		...(await detectWpProject(project)),
	};

	// If we have a config file, get the project info
	if (fs.existsSync(configPath)) {
		const { getProjectInfo: getUserProjectInfo } = (await import(
			`file:///${configPath}`
		)) as ProjectConfig;

		const projectInfo = getUserProjectInfo?.(project) || {};

		const projectInfoResult = projectInfoSchema.safeParse(projectInfo);

		if (!projectInfoResult.success) {
			throw new Error(
				`Invalid project config at "${configPathRel}".\n\nERRORS: "${projectInfoResult.error.message}"`,
			);
		}

		details = {
			...details,
			...projectInfoResult.data,
		};
	}

	// If slug is not defined, use the text domain
	details.slug = details.slug || details.textDomain;

	if (!details.slug) {
		// If the slug is still not defined, use the package name
		// It can be something like "@wpsocio/plugin-name"
		const parts = project.packageJson.name.split('/');

		details.slug = parts[1] || parts[0];
	}

	// If the key is not defined, use the slug
	details.key = details.key || details.slug.replace('-', '_');

	details.textDomain = details.textDomain || details.slug;

	// If the project type is not defined in the config file, don't give up!
	details.projectType =
		details.projectType || (await getProjectType(project, projectTypes));

	return details;
}

type ProjectBundleConfigOptions = {
	version: string;
	globalConfig?: string;
};

export async function getProjectBundleConfig(
	project: WPProject,
	{ globalConfig, version }: ProjectBundleConfigOptions,
) {
	const configPath = path.join(project.dir, PROJECT_CONFIG_FILE_NAME);
	const configPathRel = path.relative(process.cwd(), configPath);

	if (
		!fs.existsSync(configPath) &&
		(!globalConfig || !fs.existsSync(globalConfig))
	) {
		throw new Error(`Project config file not found at "${configPathRel}"`);
	}

	const { getBundleConfig } = (await import(
		`file:///${configPath || path.resolve(globalConfig || '')}`
	)) as ProjectConfig;

	if (!getBundleConfig || typeof getBundleConfig !== 'function') {
		throw new Error(
			`Invalid project config at "${configPathRel}".\n\nERRORS: "getBundleConfig" must be a function.`,
		);
	}

	const bundleResult = bundleSchema.safeParse(
		getBundleConfig({ project, ...project.wpdev, version }),
	);

	if (!bundleResult.success) {
		throw new Error(
			`Invalid project config at "${configPathRel}".\n\nERRORS: "${bundleResult.error.message}"`,
		);
	}

	return bundleResult.data;
}

export async function getStandaloneProject(dir: string) {
	const pkg = await getStandalonePackage(dir);

	if (pkg) {
		const wpdev = await getProjectInfo(pkg);
		return { ...pkg, wpdev };
	}

	return pkg;
}

/**
 * Detect WP project from the files in the directory
 */
export async function detectWpProject(
	pkg: Package,
): Promise<{ projectType: ProjectType; textDomain: string } | undefined> {
	const entries = fs.readdirSync(pkg.dir, { withFileTypes: true });

	for (const dirent of entries) {
		if (!dirent.isFile()) {
			continue;
		}

		const file = path.join(pkg.dir, dirent.name);

		if (!isFileReadable(file)) {
			return undefined;
		}

		const fileInfo = path.parse(file);

		if (fileInfo.ext === '.css' && fileInfo.name === 'style') {
			const data = await getFileData(file, zippedFileHeaders('theme'));

			// If the file has a theme name, it's a theme
			if (data['Theme Name']) {
				return { projectType: 'theme', textDomain: data['Text Domain'] };
			}
		}

		if (fileInfo.ext === '.php') {
			const data = await getFileData(file, zippedFileHeaders('plugin'));

			// If the file has a plugin name, it's a plugin
			if (data['Plugin Name']) {
				return { projectType: 'plugin', textDomain: data['Text Domain'] };
			}
		}
	}
}
