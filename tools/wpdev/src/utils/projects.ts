import fs from 'node:fs';
import path from 'node:path';
import { execa } from 'execa';
import { ReleaseType, inc as semverInc } from 'semver';
import {
	BundleConfigInput,
	ProjectInfoInput,
	bundleSchema,
	projectInfoSchema,
} from './schema.js';
import { WPProject } from './tools.js';

export function getNextVersion(project: WPProject, releaseType: string) {
	return semverInc(project.packageJson.version, releaseType as ReleaseType);
}

export async function runScript(cwd: string, script: string, pm = 'npm') {
	const cleanScript = script.replaceAll('&', '');

	return await execa(pm, ['run', cleanScript], { cwd });
}

export type ProjectConfig = {
	getProjectInfo?: (project: WPProject) => ProjectInfoInput;
	getBundleConfig: (options: {
		project: WPProject;
		slug: string;
		key: string;
		version?: string;
		textDomain: string;
	}) => BundleConfigInput;
};

export async function getProjectConfig(project: WPProject, version?: string) {
	const configPathRel = path.join(project.relativeDir, 'wpdev.project.js');

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

	const projectInfo = getProjectInfo?.(project) || {};

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
		const parts = project.packageJson.name.split('/');

		slug = parts[1] || parts[0];
	}

	if (!key) {
		// If the key is not defined, use the slug
		key = slug.replace('-', '_');
	}

	textDomain = textDomain || slug;

	const bundleResult = bundleSchema.safeParse(
		getBundleConfig({ project, slug, key, version, textDomain }),
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
