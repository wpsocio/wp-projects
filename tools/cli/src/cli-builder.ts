import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as cleanCommand from './commands/clean.js';
import { createLinkCommand, createUnlinkCommand } from './commands/link.js';

/**
 * The main entrypoint for the CLI.
 */
export async function cli() {
	const parser = yargs(hideBin(process.argv));

	parser.scriptName('wpsocio');

	parser.command(createLinkCommand());
	parser.command(createUnlinkCommand());

	parser.command(cleanCommand);

	// Do it!
	await parser.parse();
}
