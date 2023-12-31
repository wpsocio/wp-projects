import fs from 'node:fs';
import path from 'node:path';
import { $ } from 'execa';

export type PotToPhpConfig = {
	potFile: string;
	textDomain: string;
	outFile?: string;
};

/**
 * Converts JS POT file to PHP using @wordpress/i18n
 */
export async function potToPhp(
	project: string,
	{ potFile, textDomain, outFile }: PotToPhpConfig,
) {
	const potDir = path.dirname(potFile);

	const outFilePath =
		outFile || path.join(potDir, `${textDomain}-js-translations.php`);

	const args = [potFile, outFilePath, textDomain];

	// `pot-to-php` binary comes from @wordpress/i18n
	await $({ cwd: project })`pot-to-php ${args}`;
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

export async function generatePotFile(
	project: string,
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

	const result = await $({ cwd: project })`wp i18n make-pot ${args}`;

	// Replace the placeholder back with &
	const content = fs
		.readFileSync(path.join(project, outFilePath), 'utf8')
		.replaceAll(placeholder, '&');

	fs.writeFileSync(path.join(project, outFilePath), content);

	return result;
}

export type UpdatePoFilesConfig = {
	source: string;
	destination?: string;
};

export async function updatePoFiles(
	project: string,
	{ source, destination }: UpdatePoFilesConfig,
) {
	const dest = destination || path.dirname(source);
	return await $({ cwd: project })`wp i18n update-po ${source} ${dest}`;
}

export async function makeMoFiles(
	project: string,
	{ source, destination }: UpdatePoFilesConfig,
) {
	const dest = destination || source;
	return await $({ cwd: project })`wp i18n make-mo ${source} ${dest}`;
}
