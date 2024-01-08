import fs from 'node:fs';

export async function readFileBytes(
	path: string,
	endAt: number,
): Promise<string> {
	const chunks = [];

	const options = { start: 0, end: endAt };

	for await (const chunk of fs.createReadStream(path, options)) {
		chunks.push(chunk);
	}
	return Buffer.concat(chunks).toString();
}

export async function getFileData(
	file: string,
	headers: Record<string, string>,
) {
	// Read only the first 8kiB of the file in.
	let fileData = await readFileBytes(file, 8192);

	fileData = fileData.replace(/\r/g, '\n');

	return getFileDataFromString(fileData, headers);
}

/**
 * Retrieves metadata from a string.
 */
export function getFileDataFromString(
	text: string,
	headers: Record<string, string>,
) {
	const data: Record<string, string> = {};

	for (const [field, regex] of Object.entries(headers)) {
		const re = new RegExp(`^[ \t\/*#@]*${regex}:(.*)$`, 'mi');

		const match = text.match(re);

		if (match?.[1]) {
			data[field] = cleanupHeaderComment(match[1]);
		} else {
			data[field] = '';
		}
	}

	return data;
}

/**
 * Strip close comment and close php tags from file headers used by WP.
 */
export function cleanupHeaderComment(str: string) {
	return str.replace(/\s*(?:\*\/|\?>).*/g, '').trim();
}

/**
 * Returns the file headers for themes and plugins.
 */
export function getFileHeaders(type: 'plugin' | 'theme') {
	const common = [
		'Description',
		'Author',
		'Author URI',
		'Version',
		'License',
		'Domain Path',
		'Text Domain',
	];

	const headers = {
		plugin: ['Plugin Name', 'Plugin URI', ...common],
		theme: ['Theme Name', 'Theme URI', ...common],
	};

	return headers[type] || [];
}

export function zippedFileHeaders(type: 'plugin' | 'theme') {
	const headers = getFileHeaders(type);

	return headers.reduce(
		(acc, header) => {
			acc[header] = header;

			return acc;
		},
		{} as Record<string, string>,
	);
}
