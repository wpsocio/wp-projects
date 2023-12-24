// @ts-check

/**
 * @type {import('@wpsocio/dev/vite').CreateViteConfigOptions}
 */
export const dev = {
	input: {
		settings: 'js/settings/index.ts',
		'p2tg-block-editor': 'js/p2tg-block-editor/index.ts',
		'p2tg-classic-editor': 'js/p2tg-classic-editor/index.ts',
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
