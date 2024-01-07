import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const targetFilesSchema = z.object({
	files: z
		.union([z.string(), z.array(z.string())])
		.optional()
		.describe('The glob pattern for target files.'),
	ignore: z
		.array(z.string())
		.optional()
		.describe('The glob pattern for files to ignore.'),
});

const copyFilesData = z.object({
	sourceDir: z
		.string()
		.optional()
		.default('src')
		.describe('The source directory.'),
	destDir: z
		.string()
		.optional()
		.default('dist/{slug}')
		.describe('The destination directory.'),
	ignore: targetFilesSchema.shape.ignore,
});

const createArchiveData = z.object({
	outPath: z
		.string()
		.optional()
		.default('{slug}-{version}.zip')
		.describe('The path to the output file. Defaults to {slug}-{version}.zip.'),
});

const generatePotData = z.object({
	source: z
		.string()
		.optional()
		.default('src')
		.describe('The source directory.'),
	textDomain: z
		.string()
		.optional()
		.default('{slug}')
		.describe('The text domain. Can be {slug}.'),
	headers: z
		.record(z.string())
		.optional()
		.describe('The headers to pass to wp-cli i18n make-pot.'),
	mergeFiles: z
		.array(z.string())
		.optional()
		.default(['src/languages/js-translations.pot'])
		.describe('The list of POT files to merge.'),
	makePotArgs: z
		.record(z.string())
		.optional()
		.describe('The additional arguments to pass to wp-cli i18n make-pot.'),
});

const jsPotToPhpData = z.object({
	potFile: z
		.string()
		.optional()
		.default('src/languages/js-translations.pot')
		.describe('The path to the POT file.'),
	textDomain: z
		.string()
		.optional()
		.default('{slug}')
		.describe('The text domain. Can be {slug}.'),
});

const makeMoFilesData = z.object({
	source: z
		.string()
		.optional()
		.default('src/languages/')
		.describe('The source directory that contains the .po files.'),
});

const scriptsData = z
	.array(z.string())
	.describe('The list of npm scripts to run.');

const processStylesData = z.object({
	files: targetFilesSchema.shape.files
		.optional()
		.default(['src/assets/static/css/*.css']),
	ignore: targetFilesSchema.shape.ignore
		.optional()
		.default(['src/assets/static/css/*.min.css']),
});

const updatePoFilesData = z.object({
	source: z
		.string()
		.optional()
		.default('src/languages/{slug}.pot')
		.describe('The source POT file.'),
});

const updateRequirementsData = z.object({
	requirements: z.object({
		requiresPHP: z.string().describe('The minimum required PHP version.'),
		requiresAtLeast: z
			.string()
			.describe('The minimum required WordPress version.'),
		testedUpTo: z.string().describe('The tested up to WordPress version.'),
	}),
	target: targetFilesSchema.describe('The target files.'),
});

const updateVersionData = z.array(
	z.discriminatedUnion('type', [
		z
			.object({
				type: z.enum([
					'packageJson',
					'composerJson',
					'readmeFiles',
					'pluginMainFile',
					'themeStylesheet',
					'sinceTag',
				]),
			})
			.merge(targetFilesSchema),
		z
			.object({
				type: z.literal('general'),
				textPatterns: z
					.array(
						z.object({
							pattern: z.string(),
							flags: z.string().optional(),
						}),
					)
					.describe('The text patterns to match. Regex can also be used.'),
			})

			.merge(targetFilesSchema),
	]),
);

export const bundleSchema = z
	.object({
		tasks: z.array(
			z.discriminatedUnion('type', [
				z.object({
					type: z.literal('copyFiles'),
					data: copyFilesData.optional(),
				}),
				z.object({
					type: z.literal('createArchive'),
					data: createArchiveData.optional(),
				}),
				z.object({
					type: z.literal('generatePot'),
					data: generatePotData.optional(),
				}),
				z.object({
					type: z.literal('jsPotToPhp'),
					data: jsPotToPhpData.optional(),
				}),
				z.object({
					type: z.literal('makeMoFiles'),
					data: makeMoFilesData.optional(),
				}),
				z.object({
					type: z.literal('postScripts'),
					data: scriptsData.optional(),
				}),
				z.object({
					type: z.literal('preScripts'),
					data: scriptsData.optional(),
				}),
				z.object({
					type: z.literal('processStyles'),
					data: processStylesData.optional(),
				}),
				z.object({
					type: z.literal('updatePoFiles'),
					data: updatePoFilesData.optional(),
				}),
				z.object({
					type: z.literal('updateRequirements'),
					data: updateRequirementsData,
				}),
				z.object({
					type: z.literal('updateVersion'),
					data: updateVersionData.optional(),
				}),
			]),
		),
	})
	.describe('The bundling configuration.');

export const projectSchema = z.object({
	$schema: z.string().optional().describe('The schema URL.'),
	project: z.object({
		title: z
			.string()
			.optional()
			.describe('The project title. e.g. "WP Telegram Login".'),
		key: z
			.string()
			.describe(
				'The project key. Parts separated by underscore e.g. "wptelegram_login".',
			),
		slug: z
			.string()
			.describe(
				'The project slug. Parts separated by hyphen e.g. "wptelegram-login".',
			),
	}),
	bundle: bundleSchema,
});

export function createJsonSchema(outFile?: string) {
	const result = zodToJsonSchema(projectSchema);

	if (outFile) {
		const outDir = path.dirname(outFile);

		if (!fs.existsSync(outDir)) {
			fs.mkdirSync(outDir, { recursive: true });
		}

		fs.writeFileSync(outFile, JSON.stringify(result, null, '\t'), 'utf8');
	}

	return result;
}
