import path from 'node:path';
import { getPackagesSync } from '@manypkg/get-packages';
import { execaSync } from 'execa';
import { readChangesetJson } from './changelog.js';
import {
	type WPProject,
	getProjectInfo,
	pluralizeProjectType,
} from './projects.js';
import type { UserConfig } from './tools.js';

export type WPMonorepoConfig = {
	rootDir: string;
	projectTypes: UserConfig['projectTypes'];
};

type ProjectStatus = 'ignored' | 'tracked' | 'connected';

type IncludeOptions = {
	[key in ProjectStatus]?: boolean;
};

export class WPMonorepo {
	config: WPMonorepoConfig;

	constructor(config: WPMonorepoConfig) {
		this.config = config;
	}

	/**
	 * Returns an array of connected project names as defined in the CONNECTED_PROJECTS env var.
	 */
	getConnectedProjectsNames() {
		return [
			...new Set(
				(process.env.CONNECTED_PROJECTS || '')
					.split(',')
					.map((project) => project.trim())
					.filter(Boolean),
			),
		];
	}

	getProjectStatus(project: WPProject): ProjectStatus {
		// Connected is a subset of ignored, so we need to check for connected first
		if (this.getConnectedProjectsNames().includes(project.packageJson.name)) {
			return 'connected';
		}

		// If the project is in the "premium" folder
		// e.g. "premium/plugins/wptelegram-pro"
		const isPremium = project.relativeDir.startsWith(
			path.normalize('premium/'),
		);

		// If the project is premium, it should be treated as connected
		if (isPremium) {
			return 'connected';
		}

		try {
			// If `git check-ignore <pathname>` succeeds, it means the path is ignored
			execaSync('git', ['check-ignore', project.dir]);

			return 'ignored';
		} catch (e) {
			return 'tracked';
		}
	}

	async getWpPackages() {
		const { packages } = getPackagesSync(this.config.rootDir);

		const projects = await Promise.all(
			packages.map(async (pkg) => {
				const wpdev = await getProjectInfo(pkg, this.config.projectTypes);

				return { ...pkg, wpdev };
			}),
		);

		return projects.filter(
			(project) => project.wpdev.projectType,
		) as Array<WPProject>;
	}

	/**
	 * Get projects.
	 */
	async getProjects(include: IncludeOptions) {
		const projects = new Map<string, WPProject>();

		for (const project of await this.getWpPackages()) {
			const status = this.getProjectStatus(project);

			if (include[status]) {
				projects.set(project.packageJson.name, project);
			}
		}

		return projects;
	}

	async getManagedProjects() {
		return await this.getProjects({ connected: true, tracked: true });
	}

	async getAllProjects() {
		return await this.getProjects({
			connected: true,
			tracked: true,
			ignored: true,
		});
	}

	async getProjectsByName(
		projectNames: Array<string>,
		{ throwIfNotFound = true }: { throwIfNotFound?: boolean } = {},
	) {
		const managedProjects = await this.getManagedProjects();

		const projects = new Map<string, WPProject>();

		for (const projectName of projectNames) {
			const project = managedProjects.get(projectName);

			if (project) {
				projects.set(projectName, project);
			} else if (throwIfNotFound) {
				throw new Error(
					`Invalid project: Could not find a WordPress project with name: "${projectName}"`,
				);
			}
		}

		return projects;
	}

	/**
	 * Get the symlink path for an item
	 */
	getSymlinkPath({ wpdev }: WPProject, wpContentDir: string) {
		return path.join(
			wpContentDir,
			pluralizeProjectType(wpdev.projectType),
			wpdev.slug,
		);
	}

	async getProjectsToRelease(changesetJsonFile: string) {
		const projectNames = readChangesetJson(changesetJsonFile)
			// Get the names of projects that have changesets, ignoring the ones that don't
			.releases.filter(({ changesets }) => changesets.length)
			// Collect the names
			.map((release) => release.name);

		return await this.getProjectsByName(projectNames, {
			throwIfNotFound: false,
		});
	}
}
