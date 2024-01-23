import { Flags } from '@oclif/core';
import chalk from 'chalk';
import { WithProjects } from '../base-commands/WithProjects.js';

export default class ProjectInfo extends WithProjects<typeof ProjectInfo> {
	static description = 'Get the project info as JSON.';

	static flags = {
		pretty: Flags.boolean({
			description: 'Pretty print the JSON output.',
		}),
	};

	static args = {
		...WithProjects.args,
	};

	public async run(): Promise<void> {
		try {
			const projects = [...this.projects].map(
				([name, { relativeDir, dir, packageJson }]) => {
					return {
						name,
						version: packageJson.version,
						relativeDir,
						dir,
						wpdev: packageJson.wpdev,
					};
				},
			);

			const result =
				this.cliConfig.operationMode !== 'wp-monorepo' ? projects[0] : projects;

			this.flags.pretty
				? this.logJson(result)
				: this.log(JSON.stringify(result));
		} catch (error) {
			this.log(chalk.red((error as { message: string }).message));
			process.exitCode = 1;
		}
	}
}
