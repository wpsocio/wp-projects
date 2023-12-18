import fs from 'node:fs';
import path from 'node:path';
import { ROOT_DIR } from './monorepo.js';

export const PROJECT_TYPES = ['plugins'] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

const GIT_IGNORE_PATH = path.join(ROOT_DIR, '.gitignore');

const gitIgnoreContent = fs.readFileSync(GIT_IGNORE_PATH, 'utf8');

export function projectDirectories(projectType: ProjectType) {
	return fs
		.readdirSync(path.join(ROOT_DIR, projectType), { withFileTypes: true })
		.filter((dirent) => {
			if (!dirent.isDirectory()) {
				return false;
			}
			// We expect an entry like this in the .gitignore file:
			// !/plugins/plugin-name/
			const RE = new RegExp(`[^#]!/${projectType}/${dirent.name}/`);

			return RE.test(gitIgnoreContent);
		})
		.map((dirent) => `${projectType}/${dirent.name}`);
}

export function getAllProjects() {
	let projects: Array<string> = [];

	for (const projectType of PROJECT_TYPES) {
		projects = projects.concat(projectDirectories(projectType));
	}

	return projects;
}

export function validateProject(project: string) {
	if (!getAllProjects().includes(project)) {
		throw new Error(`Invalid project: ${project}`);
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
