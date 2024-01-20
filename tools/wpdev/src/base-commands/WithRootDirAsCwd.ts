import { WithConfig } from './WithConfig.js';

export abstract class WithRootDirAsCwd extends WithConfig {
	/**
	 * The directory from which the command was run.
	 */
	protected commandCwd!: string;

	public async init() {
		await super.init();

		this.commandCwd = process.cwd();

		// Change the current working directory to the root directory
		process.chdir(this.cliConfig.rootDir);
	}
}
