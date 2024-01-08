import { WithConfig } from './WithConfig.js';

export abstract class WithRootDirAsCwd extends WithConfig {
	/**
	 * The directory from which the command was run.
	 */
	protected actualCwd!: string;

	public async init() {
		await super.init();

		// Save the actual current working directory
		this.actualCwd = process.cwd();

		// Change the current working directory to the root directory
		process.chdir(this.devConfig.rootDir);
	}
}
