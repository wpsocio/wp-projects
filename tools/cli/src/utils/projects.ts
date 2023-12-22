import fs from 'node:fs';
import path from 'node:path';
import { ROOT_DIR } from './monorepo.js';

export const PROJECT_TYPES = ['plugins'] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

type ProjectStatus = 'ignored' | 'tracked' | 'connected';

type IncludeOptions = {
	[key in ProjectStatus]?: boolean;
};

type ProjectDetails = {
	path: string;
	status: ProjectStatus;
};

const GIT_IGNORE_PATH = path.join(ROOT_DIR, '.gitignore');

const gitIgnoreContent = fs.readFileSync(GIT_IGNORE_PATH, 'utf8');

const connectedProjects = (process.env.CONNECTED_PROJECTS || '')
	.split(',')
	.map((project) => project.trim())
	.filter(Boolean);

function getProjectDetails(
	dirent: fs.Dirent,
	projectType: ProjectType,
): ProjectDetails {
	const projectPath = `${projectType}/${dirent.name}`;

	// Connected is a subset of ignored, so we need to check for connected first
	if (connectedProjects.includes(`${projectType}/${dirent.name}`)) {
		return {
			path: projectPath,
			status: 'connected',
		};
	}

	// For tracked projects, we expect an entry like this in the .gitignore file:
	// !/plugins/plugin-name/, !themes/theme-name/
	const RE = new RegExp(`[^#]!/${projectType}/${dirent.name}/`);

	if (RE.test(gitIgnoreContent)) {
		return {
			path: projectPath,
			status: 'tracked',
		};
	}

	return {
		path: projectPath,
		status: 'ignored',
	};
}

function getProjectDirectoriesByType(projectType: ProjectType) {
	return fs
		.readdirSync(path.join(ROOT_DIR, projectType), { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory());
}

/**
 * Get projects.
 *
 * By default, it returns all projects that are connected or tracked.
 */
export function getProjects(include: IncludeOptions) {
	const projects = new Set<string>();

	for (const projectType of PROJECT_TYPES) {
		for (const project of getProjectDirectoriesByType(projectType)) {
			const projectDetails = getProjectDetails(project, projectType);

			if (include[projectDetails.status]) {
				projects.add(projectDetails.path);
			}
		}
	}

	return projects;
}

export function getMonorepoProjects() {
	return getProjects({ connected: true, tracked: true });
}

export function getAllProjects() {
	return getProjects({ connected: true, tracked: true, ignored: true });
}

export function validateProject(project: string) {
	if (getMonorepoProjects().has(project)) {
		throw new Error(`Invalid project: "${project}"`);
	}
}

/**
 * Get the real path for a project
 */
export function getRealPath(project: string, relativeTo = ROOT_DIR) {
	return path.join(relativeTo, project);
}

/**
 * Get the symlink path for an item
 */
export function getSymlinkPath(project: string, relativeTo: string) {
	return path.join(relativeTo, project);
}
