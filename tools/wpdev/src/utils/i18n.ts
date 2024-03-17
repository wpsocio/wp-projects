import fs from 'node:fs';
import path from 'node:path';
import { $ } from 'execa';
import { convertPOTToPHP } from './pot-to-php.js';

export type PotToPhpConfig = {
	potFile: string;
	textDomain: string;
	outFile?: string;
};

/**
 * Converts JS POT file to PHP using @wordpress/i18n
 */
export async function potToPhp(
	cwd: string,
	{ potFile, textDomain, outFile }: PotToPhpConfig,
) {
	const potFilePath = fs.existsSync(potFile)
		? path.resolve(potFile)
		: path.join(cwd, potFile);

	const potDir = path.dirname(potFilePath);

	const outFilePath = path.join(
		potDir,
		outFile || `${textDomain}-js-translations.php`,
	);

	convertPOTToPHP(potFilePath, outFilePath, { textDomain });
}

export type GeneratePotFileConfig = Pick<
	PotToPhpConfig,
	'outFile' | 'textDomain'
> & {
	source?: string;
	makePotArgs?: Record<string, string>;
	headers?: Record<string, string>;
	mergeFiles?: Array<string>;
};

export async function makePot(
	cwd: string,
	{
		outFile,
		textDomain,
		source,
		headers,
		mergeFiles = [],
		makePotArgs = {},
	}: GeneratePotFileConfig,
) {
	const extraArgs: Record<string, string> = {
		domain: textDomain,
		headers: JSON.stringify(headers || {}),
		...makePotArgs,
	};

	const outFilePath = outFile || `src/languages/${textDomain}.pot`;

	let args = [source || '.', outFilePath];

	for (const [flag, value] of Object.entries(extraArgs)) {
		args.push(value ? `--${flag}=${value}` : `--${flag}`);
	}

	if (mergeFiles.length > 0) {
		args.push(`--merge=${mergeFiles.join(',')}`);
	}

	// Replace & with a placeholder because execa doesn't work with & in args on Windows
	const placeholder = '____amp____';
	args = args.map((arg) => arg.replaceAll('&', placeholder));

	const result = await $({ cwd })`wp i18n make-pot ${args}`;

	// Replace the placeholder back with &
	const content = fs
		.readFileSync(path.join(cwd, outFilePath), 'utf8')
		.replaceAll(placeholder, '&');

	fs.writeFileSync(path.join(cwd, outFilePath), content);

	return result;
}

export type UpdatePoFilesConfig = {
	source: string;
	destination?: string;
};

export async function updatePo(
	cwd: string,
	{ source, destination }: UpdatePoFilesConfig,
) {
	const dest = destination || path.dirname(source);
	return await $({ cwd })`wp i18n update-po ${source} ${dest}`;
}

export async function makeMo(
	cwd: string,
	{ source, destination }: UpdatePoFilesConfig,
) {
	const dest = destination || source;
	return await $({ cwd })`wp i18n make-mo ${source} ${dest}`;
}

export async function makePhp(
	cwd: string,
	{ source, destination }: UpdatePoFilesConfig,
) {
	const dest = destination || source;
	return await $({ cwd })`wp i18n make-php ${source} ${dest}`;
}
