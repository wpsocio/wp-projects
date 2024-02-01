// @ts-check

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
						requiresPHP: '7.4',
						requiresAtLeast: '6.2',
						testedUpTo: '6.4.3',
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
						type: 'composerJson',
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
						files: ['**/*.php'],
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
				type: 'generate-pot',
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
				type: 'update-po-files',
				data: {
					source: `src/languages/${slug}.pot`,
				},
			},
			{
				type: 'make-mo-files',
				data: {
					source: 'src/languages/',
				},
			},
			{
				type: 'js-pot-to-php',
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
