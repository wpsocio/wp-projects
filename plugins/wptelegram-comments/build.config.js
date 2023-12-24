// @ts-check

/**
 * @type {import('@wpsocio/dev/vite').CreateViteConfigOptions}
 */
export const dev = {
	input: {
		settings: 'js/settings/index.ts',
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
