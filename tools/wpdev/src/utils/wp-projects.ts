import fs from 'node:fs';
import path from 'node:path';

export type Config = {
	rootDir: string;
	projectTypes: Array<string>;
	repoType: 'monorepo' | 'single';
};

export type ProjectType = string; // 'plugins' | 'themes';

type ProjectStatus = 'ignored' | 'tracked' | 'connected';

type IncludeOptions = {
	[key in ProjectStatus]?: boolean;
};

type ProjectDetails = {
	path: string;
	status: ProjectStatus;
};

export class WPProjects {
	config: Config;

	constructor(config: Config) {
		this.config = config;
	}

	getGitIgnoreContent() {
		const GIT_IGNORE_PATH = path.join(this.config.rootDir, '.gitignore');

		const gitIgnoreContent = fs.readFileSync(GIT_IGNORE_PATH, 'utf8');

		return gitIgnoreContent;
	}

	getConnectedProjects() {
		// Connected projects are only used in monorepo mode
		if (this.config.repoType === 'single') {
			return [];
		}
		return (process.env.CONNECTED_PROJECTS || '')
			.split(',')
			.map((project) => project.trim())
			.filter(Boolean);
	}

	getProjectDetails(
		dirent: fs.Dirent,
		projectType: ProjectType,
	): ProjectDetails {
		const projectPath = `${projectType}/${dirent.name}`;

		// Connected is a subset of ignored, so we need to check for connected first
		if (this.getConnectedProjects().includes(`${projectType}/${dirent.name}`)) {
			return {
				path: projectPath,
				status: 'connected',
			};
		}

		// For tracked projects, we expect an entry like this in the .gitignore file:
		// !/plugins/plugin-name/, !themes/theme-name/
		const RE = new RegExp(`[^#]!/${projectType}/${dirent.name}/`);

		if (RE.test(this.getGitIgnoreContent())) {
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

	getProjectDirectoriesByType(projectType: ProjectType) {
		return fs
			.readdirSync(path.join(this.config.rootDir, projectType), {
				withFileTypes: true,
			})
			.filter((dirent) => dirent.isDirectory());
	}

	/**
	 * Get projects.
	 *
	 * By default, it returns all projects that are connected or tracked.
	 */
	getProjects(include: IncludeOptions) {
		const projects = new Set<string>();

		if (this.config.repoType === 'single') {
			return projects;
		}

		for (const projectType of this.config.projectTypes) {
			for (const project of this.getProjectDirectoriesByType(projectType)) {
				const projectDetails = this.getProjectDetails(project, projectType);

				if (include[projectDetails.status]) {
					projects.add(projectDetails.path);
				}
			}
		}

		return projects;
	}

	getMonorepoProjects() {
		return this.getProjects({ connected: true, tracked: true });
	}

	getAllProjects() {
		return this.getProjects({ connected: true, tracked: true, ignored: true });
	}

	validateProject(project: string) {
		if (!this.getMonorepoProjects().has(project)) {
			throw new Error(`Invalid project: ${project}`);
		}
	}

	/**
	 * Get the real path for a project
	 */
	getRealPath(project: string, relativeTo = this.config.rootDir) {
		return path.join(relativeTo, project);
	}

	/**
	 * Get the symlink path for an item
	 */
	getSymlinkPath(project: string, relativeTo: string) {
		return path.join(relativeTo, project);
	}
}
