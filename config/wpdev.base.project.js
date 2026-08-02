// @ts-check

/**
 * PHP versions the CI matrices run against.
 * The first one is the minimum required, the last one is the latest.
 */
export const phpVersions = ['8.0', '8.1', '8.2', '8.3', '8.4', '8.5'];

/**
 * WordPress versions the CI matrices run against.
 * The first one is the minimum required.
 */
export const wpVersions = ['6.7', 'master'];

/**
 * @type {import("@wpsocio/wpdev").ProjectConfig['getBundleConfig']}
 */
export const getBundleConfig = ({ slug, key, version, textDomain }) => {
	return {
		tasks: [
			{
				type: 'run-scripts',
				data: [
					// Install composer dependencies for production
					'setup:php:prod',
					'build',
				],
			},
			{
				type: 'update-requirements',
				data: {
					requirements: {
						requiresPHP: phpVersions[0],
						requiresAtLeast: wpVersions[0],
						testedUpTo: '7.0.2',
					},
					target: {
						files: [
							'dev.php',
							`src/${slug}.php`,
							'src/readme.txt',
							'README.md',
						],
					},
				},
			},
			{
				type: 'update-version',
				data: [
					{
						type: 'packageJson',
					},
					{
						type: 'readmeFiles',
					},
					{
						type: 'pluginMainFile',
					},
					{
						type: 'sinceTag',
					},
					{
						type: 'general',
						files: [`src/${slug}.php`],
						textPatterns: [
							{
								pattern: `${key}_VER',\\s*'([0-9a-z-+.]+)`,
								flags: 'gi',
							},
						],
					},
					{
						// Replace 'x.y.z' everywhere with the new version
						type: 'general',
						textPatterns: [
							{
								pattern: `'(x.y.z)'`,
								flags: 'gi',
							},
						],
					},
				],
			},
			{
				type: 'update-changelog',
				data: {
					readmeTxtFile: 'src/readme.txt',
				},
			},
			{
				type: 'i18n-make-pot',
				data: {
					source: 'src',
					textDomain,
					headers: {
						language: 'en_US',
						'X-Poedit-Basepath': '..',
						'Plural-Forms': 'nplurals=2; plural=n != 1;',
						'X-Poedit-KeywordsList':
							'__;_e;_x;esc_attr__;esc_attr_e;esc_html__;esc_html_e',
						'X-Poedit-SearchPath-0': '.',
						'X-Poedit-SearchPathExcluded-0': 'assets',
					},
					mergeFiles: ['src/languages/js-translations.pot'],
					makePotArgs: {
						slug,
					},
				},
			},
			{
				type: 'i18n-update-po',
				data: {
					source: `src/languages/${slug}.pot`,
				},
			},
			{
				type: 'i18n-make-mo',
				data: {
					source: 'src/languages/',
				},
			},
			{
				type: 'i18n-make-php',
				data: {
					source: 'src/languages/',
				},
			},
			{
				type: 'i18n-js-pot-to-php',
				data: {
					potFile: 'src/languages/js-translations.pot',
					textDomain,
				},
			},
			{
				type: 'minify-styles',
				data: {
					files: ['src/assets/static/css/*.css'],
					ignore: ['src/assets/static/css/*.min.css'],
				},
			},
			{
				type: 'validate-files',
				data: [
					{
						paths: [
							'src/assets/build/dependencies.json',
							'src/assets/build/manifest.json',
						],
						rules: [
							{
								value: 'EXISTS',
							},
						],
					},
					{
						paths: ['src/assets/build/dev-server.json'],
						rules: [
							{
								value: 'NOT_EXISTS',
							},
						],
					},
				],
			},
			{
				type: 'copy-files',
				data: {},
			},
			{
				type: 'create-archive',
				data: {
					outPath: `${slug}-${version}.zip`,
				},
			},
		],
	};
};
