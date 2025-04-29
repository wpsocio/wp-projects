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
	phpFile: z
		.string()
		.optional()
		.describe('The path to the PHP file, relative to the pot file directory.'),
	textDomain: z
		.string()
		.optional()
		.describe('The text domain. Defaults to slug.'),
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
	destination: z
		.string()
		.optional()
		.describe(
			'The destination directory for the PO files. Defaults to "src/languages/"',
		),
});

const makeMoFilesData = z.object({
	source: z
		.string()
		.optional()
		.default('src/languages/')
		.describe('The source directory that contains the .po files.'),
	destination: z
		.string()
		.optional()
		.describe(
			'The destination directory for the .mo files. Defaults to the source directory.',
		),
});

const makePhpFilesData = z.object({
	source: z
		.string()
		.optional()
		.default('src/languages/')
		.describe('The source directory that contains the .po files.'),
	destination: z
		.string()
		.optional()
		.describe(
			'The destination directory for the .php files. Defaults to the source directory.',
		),
});

const makeJsonFilesData = z.object({
	source: z
		.string()
		.optional()
		.default('src/languages/')
		.describe('The source directory that contains the .po files.'),
	destination: z
		.string()
		.optional()
		.describe(
			'The destination directory for the .json files. Defaults to the source directory.',
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

const pattern = z.union([
	z.object({
		pattern: z.string().describe('The text pattern to match.'),
		flags: z.string().optional().describe('The regex flags.'),
	}),
	z.object({
		pattern: z.instanceof(RegExp).describe('The regex pattern to match.'),
	}),
]);

const updateChangelogData = z.object({
	readmeTxtFile: z.string().optional().default('src/readme.txt'),
	defaultChange: z.string().optional().default('Maintenance release.'),
	prevChangesPattern: pattern
		.optional()
		.default({
			pattern:
				'== Changelog ==[\\n]{1,2}(.*?)[\\n]{1,2}\\[See full changelog\\]',
			flags: 's',
		})
		.describe(
			'The regex to match the previous changelog. The pattern must have a capturing group for actual changes.',
		),
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
					.array(pattern)
					.describe('The text patterns to match. Regex can also be used.'),
			})
			.merge(targetFilesSchema.partial()),
	]),
);

const copyFilesData = z.object({
	stripFromPath: z
		.string()
		.optional()
		.default('src')
		.describe(
			'The string/path to strip from the source file paths before copying them.',
		),
	files: targetFilesSchema.shape.files
		.optional()
		.default(['src/**/*', 'CHANGELOG.md']),
	ignore: targetFilesSchema.shape.ignore,
});

const validateFilesData = z.array(
	z.object({
		paths: z.array(z.string()),
		rules: z.array(
			z.object({
				value: z.union([z.literal('EXISTS'), z.literal('NOT_EXISTS')]),
				message: z.string().optional(),
			}),
		),
	}),
);

const createArchiveData = z.object({
	outPath: z
		.string()
		.optional()
		.describe(
			'The path to the output file. Defaults to "{slug}-{version}.zip".',
		),
});

export type UpdateChangelogOptions = z.infer<typeof updateChangelogData>;

export type UpdateVersionInput = z.input<typeof updateVersionData>;

export type ValidateFilesInput = z.input<typeof validateFilesData>;

export const bundleSchema = z
	.object({
		tasks: z.array(
			z.discriminatedUnion('type', [
				z.object({
					type: z.literal('run-scripts'),
					data: scriptsData,
				}),
				z.object({
					type: z.literal('update-requirements'),
					data: updateRequirementsData,
				}),
				z.object({
					type: z.literal('update-version'),
					data: updateVersionData,
				}),
				z.object({
					type: z.literal('update-changelog'),
					data: updateChangelogData,
				}),
				z.object({
					type: z.literal('i18n-make-pot'),
					data: generatePotData,
				}),
				z.object({
					type: z.literal('i18n-update-po'),
					data: updatePoFilesData,
				}),
				z.object({
					type: z.literal('i18n-make-mo'),
					data: makeMoFilesData,
				}),
				z.object({
					type: z.literal('i18n-make-php'),
					data: makePhpFilesData,
				}),
				z.object({
					type: z.literal('i18n-make-json'),
					data: makeJsonFilesData,
				}),
				z.object({
					type: z.literal('i18n-js-pot-to-php'),
					data: jsPotToPhpData,
				}),
				z.object({
					type: z.literal('minify-styles'),
					data: processStylesData,
				}),
				z.object({
					type: z.literal('validate-files'),
					data: validateFilesData,
				}),
				z.object({
					type: z.literal('copy-files'),
					data: copyFilesData,
				}),
				z.object({
					type: z.literal('create-archive'),
					data: createArchiveData,
				}),
			]),
		),
	})
	.describe('The bundling configuration.');

export type BundleConfigInput = z.input<typeof bundleSchema>;
export type BundleConfig = z.infer<typeof bundleSchema>;

export const projectInfoSchema = z.object({
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
	projectType: z
		.enum(['plugin', 'theme', 'mu-plugin'])
		.optional()
		.describe('The project type.'),
});

export type ProjectInfoInput = z.input<typeof projectInfoSchema>;
export type ProjectInfo = Required<z.infer<typeof projectInfoSchema>>;

export const projectSchema = z.object({
	project: projectInfoSchema.optional(),
	bundle: bundleSchema,
});
