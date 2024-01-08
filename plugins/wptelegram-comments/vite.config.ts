import { createViteConfig, defineConfig } from '@wpsocio/wpdev/vite';

export default defineConfig(
	createViteConfig({
		input: {
			settings: 'js/settings/index.ts',
		},
		outDir: 'src/assets/build',
		makePot: {
			output: 'src/languages/js-translations.pot',
		},
	}),
);
