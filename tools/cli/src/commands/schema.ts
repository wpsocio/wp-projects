import { Command, Flags } from '@oclif/core';
import { createJsonSchema } from '../utils/schema.js';

export default class Schema extends Command {
	static description = 'Generates the CLI schema.';

	static examples = [
		'<%= config.bin %> <%= command.id %>',
		'<%= config.bin %> <%= command.id %> --out-file=path/to/schema.json --print',
	];

	static flags = {
		'out-file': Flags.string({
			char: 'o',
			description: 'The path to the output file.',
			default: 'schema.json',
			exclusive: ['no-out-file'],
		}),
		'no-out-file': Flags.boolean({
			description: 'Do not output to a file.',
		}),
		print: Flags.boolean({
			description: 'Print the schema to stdout.',
		}),
		'pretty-print': Flags.boolean({
			description: 'Pretty print the schema.',
		}),
	};

	public async run(): Promise<void> {
		const { flags } = await this.parse(Schema);

		const result = createJsonSchema(
			!flags['no-out-file'] ? flags['out-file'] : '',
		);

		if (flags['no-out-file'] || flags.print || flags['pretty-print']) {
			const json = JSON.stringify(result, null, flags['pretty-print'] ? 2 : 0);

			this.log(json);
		}
	}
}
