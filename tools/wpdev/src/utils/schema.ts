import { z } from 'zod';

const targetFilesSchema = z.object({
	files: z
		.union([z.string(), z.array(z.string())])
		.describe('The glob pattern for target files.'),
	ignore: z
		.array(z.string())
		.optional()
		.describe('The glob pattern for files to ignore.'),
});

const copyFilesData = z.object({
	relativeSource: z
		.string()
		.optional()
		.default('src')
		.describe('The directory relative to which the source files are.'),
	files: targetFilesSchema.shape.files
		.optional()
		.default(['**/*', '../CHANGELOG.md', '../README.md']),
	ignore: targetFilesSchema.shape.ignore,
});

const createArchiveData = z.object({
	outPath: z
		.string()
		.optional()
		.describe(
			'The path to the output file. Defaults to "{slug}-{version}.zip".',
		),
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
		.describe('The text domain. Defaults to slug.'),
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
		.describe('The text domain. Defaults to slug.'),
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
	ignore: targetFilesSchema.shape.ignore.default([
		'src/assets/static/css/*.min.css',
	]),
});

const updatePoFilesData = z.object({
	source: z
		.string()
		.optional()
		.describe(
			'The source POT file. Defaults to "src/languages/{text-domain}.pot"',
		),
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

const updateChangelogData = z.object({
	readmeTxtFile: z.string().optional().default('src/readme.txt'),
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
				]),
			})
			.merge(targetFilesSchema.partial()),
		z
			.object({
				type: z.literal('sinceTag'),
				onlyIfStable: z
					.boolean()
					.optional()
					.default(true)
					.describe('The text patterns to match. Regex can also be used.'),
			})
			.merge(targetFilesSchema.partial()),
		z
			.object({
				type: z.literal('general'),
				textPatterns: z
					.array(
						z.union([
							z.object({
								pattern: z.string(),
								flags: z.string().optional(),
							}),
							z.object({
								pattern: z.instanceof(RegExp),
							}),
						]),
					)
					.describe('The text patterns to match. Regex can also be used.'),
			})
			.merge(targetFilesSchema),
	]),
);

export type UpdateChangelogOptions = z.infer<typeof updateChangelogData>;

export type UpdateVersionInput = z.input<typeof updateVersionData>;

export const bundleSchema = z
	.object({
		tasks: z
			.object({
				preScripts: scriptsData,
				copyFilesBefore: copyFilesData,
				updateRequirements: updateRequirementsData,
				updateVersion: updateVersionData,
				updateChangelog: updateChangelogData,
				generatePot: generatePotData,
				updatePoFiles: updatePoFilesData,
				makeMoFiles: makeMoFilesData,
				jsPotToPhp: jsPotToPhpData,
				minifyStyles: processStylesData,
				postScripts: scriptsData,
				copyFilesAfter: copyFilesData,
				createArchive: createArchiveData,
			})
			.partial(),
	})
	.describe('The bundling configuration.');

export type BundleConfigInput = z.input<typeof bundleSchema>;
export type BundleConfig = z.infer<typeof bundleSchema>;

export const projectInfoSchema = z.object({
	title: z
		.string()
		.optional()
		.describe('The project title. e.g. "WP Telegram Login".'),
	key: z
		.string()
		.optional()
		.describe(
			'The project key. Parts separated by underscore e.g. "wptelegram_login".',
		),
	slug: z
		.string()
		.optional()
		.describe(
			'The project slug. Parts separated by hyphen e.g. "wptelegram-login".',
		),
	textDomain: z
		.string()
		.optional()
		.describe('The text domain for i18n e.g. "wptelegram-login".'),
});

export type ProjectInfoInput = z.input<typeof projectInfoSchema>;
export type ProjectInfo = z.infer<typeof projectInfoSchema>;

export const projectSchema = z.object({
	project: projectInfoSchema.optional(),
	bundle: bundleSchema,
});
