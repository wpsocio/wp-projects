// @ts-check

/**
 * @type {import('@wpsocio/dev/vite').CreateViteConfigOptions}
 */
export const dev = {
	input: {
		settings: 'js/settings/index.ts',
		blocks: 'js/blocks/index.ts',
		'web-app-login': 'js/web-app-login/index.ts',
		'wp-login': 'js/wp-login/index.ts',
	},
	outDir: 'src/assets/build',
};

/**
 * @type {import('@wpsocio/dev/vite').CreateViteConfigOptions}
 */
export const build = {
	...dev,
	makePot: {
		output: 'src/languages/js-translations.pot',
	},
};
