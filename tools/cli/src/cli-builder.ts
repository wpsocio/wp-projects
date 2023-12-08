import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { createLinkCommand, createUnlinkCommand } from './commands/link.js';

/**
 * The main entrypoint for the CLI.
 */
export async function cli() {
	let parser = yargs(hideBin(process.argv));

	parser.scriptName('wpsocio');

	parser.command(createLinkCommand());
	parser.command(createUnlinkCommand());

	// Do it!
	await parser.parse();
}
