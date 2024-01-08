import fs from 'node:fs';
import chalk from 'chalk';

export const DEFAULT_MESSAGES = {
	linkAreadyExists: 'Symlink at "{symlinkPath}" already exists. ✅',
	dirAlreadyExists:
		'Warning: Failed to create symlink. Directory already exists: "{symlinkPath}"\n',
	linkIsDirectory:
		'Warning: Cannot remove symlink at "{symlinkPath}" as it is a directory and not a symlink.\n',
	dirDoesNotExist:
		'Error: Failed to create symlink. Directory does not exist: "{realPath}"\n',
	creatLinkSuccess:
		'Successfully created a symlink at "{symlinkPath}" pointing to "{realPath}" ✅\n',
	createLinkError: 'Error creating symlink at "{symlinkPath}"',
	removeLinkError: 'Failed to remove symlink at "{symlinkPath}"',
	removeLinkSuccess:
		'Removed symlink at "{symlinkPath}" pointing to "{realPath}" ✅\n',
	linkDoesNotExist:
		'Failed to remove symlink. Symlink does not exist: "{symlinkPath}"\n',
};

type Messages = Partial<typeof DEFAULT_MESSAGES>;

export type BaseArgs = {
	symlinkPath?: string;
	realPath?: string;
};

export class SymlinkManager {
	#symlinkPath: string;
	#realPath: string;
	#validateRealPath: boolean;
	#messages: Messages;

	constructor({
		validateRealPath = true,
		symlinkPath = '',
		realPath = '',
		messages = DEFAULT_MESSAGES,
	} = {}) {
		this.#validateRealPath = validateRealPath;
		this.#symlinkPath = symlinkPath;
		this.#realPath = realPath;
		this.#messages = messages;
	}

	private init(
		{
			symlinkPath = this.#symlinkPath,
			realPath = this.#realPath,
		}: BaseArgs = {},
		{ needsRealPath = true } = {},
	) {
		this.#symlinkPath = symlinkPath;
		this.#realPath = realPath;

		if (!this.#symlinkPath) {
			if (needsRealPath) {
				throw new Error('Both symlinkPath and realPath must be provided.');
			}
			throw new Error('symlinkPath must be provided.');
		}
	}

	public setMessages(messages: Messages) {
		this.#messages = { ...this.#messages, ...messages };
	}

	private getStats(path: string) {
		return fs.lstatSync(path, { throwIfNoEntry: false });
	}

	private symlinkExists() {
		return this.getStats(this.#symlinkPath)?.isSymbolicLink();
	}

	private dirExists(symlinkPath: string) {
		return this.getStats(symlinkPath)?.isDirectory();
	}

	private getMessage(
		type: keyof typeof DEFAULT_MESSAGES,
		{
			symlinkPath = this.#symlinkPath,
			realPath = this.#realPath,
		}: BaseArgs = {},
	) {
		return this.#messages[type]
			?.replace('{symlinkPath}', symlinkPath)
			.replace('{realPath}', realPath);
	}

	public createSymlink(args: BaseArgs = {}) {
		this.init(args);

		if (this.symlinkExists()) {
			return this.getMessage('linkAreadyExists');
		}
		if (this.dirExists(this.#symlinkPath)) {
			return chalk.yellow(this.getMessage('dirAlreadyExists'));
		}
		if (this.#validateRealPath && !this.dirExists(this.#realPath)) {
			return chalk.red(this.getMessage('dirDoesNotExist'));
		}
		try {
			fs.symlinkSync(this.#realPath, this.#symlinkPath, 'junction');
			return chalk.green(this.getMessage('creatLinkSuccess'));
		} catch (error) {
			return chalk.red(this.getMessage('createLinkError'), error, '\n');
		}
	}

	public removeSymlink(args: BaseArgs = {}) {
		this.init(args);

		if (this.dirExists(this.#symlinkPath)) {
			return chalk.yellow(this.getMessage('linkIsDirectory'));
		}

		if (!this.symlinkExists()) {
			return chalk.red(this.getMessage('linkDoesNotExist'));
		}

		try {
			const linkTarget = fs.readlinkSync(this.#symlinkPath);

			fs.unlinkSync(this.#symlinkPath);
			return chalk.green(
				this.getMessage('removeLinkSuccess', { realPath: linkTarget }),
			);
		} catch (error) {
			return chalk.red(this.getMessage('removeLinkError'), error, '\n');
		}
	}
}
