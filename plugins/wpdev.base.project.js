// @ts-check

/**
 * @type {import("@wpsocio/wpdev").ProjectConfig['getBundleConfig']}
 */
export const getBundleConfig = ({ slug, key, version, textDomain }) => {
	return {
		tasks: {
			preScripts: ['setup:php:prod'],
			updateRequirements: {
				requirements: {
					requiresPHP: '8.0',
					requiresAtLeast: '6.2',
					testedUpTo: '6.4.1',
				},
				target: {
					files: ['dev.php', `src/${slug}.php`, 'src/README.txt', 'README.md'],
				},
			},
			updateVersion: [
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
			],
			generatePot: {
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
			updatePoFiles: {
				source: `src/languages/${slug}.pot`,
			},
			makeMoFiles: {
				source: 'src/languages/',
			},
			jsPotToPhp: {
				potFile: 'src/languages/js-translations.pot',
				textDomain,
			},
			minifyStyles: {
				files: ['src/assets/static/css/*.css'],
				ignore: ['src/assets/static/css/*.min.css'],
			},
			copyFilesAfter: {
				// sourceDir: 'src',
			},
			createArchive: {
				outPath: `${slug}-${version}.zip`,
			},
		},
	};
};
