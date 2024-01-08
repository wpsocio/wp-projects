import { createViteConfig, defineConfig } from '@wpsocio/wpdev/vite';

export default defineConfig(
	createViteConfig({
		input: {
			blocks: 'js/blocks/index.ts',
			public: 'js/public/index.ts',
			settings: 'js/settings/index.ts',
		},
		outDir: 'src/assets/build',
		makePot: {
			output: 'src/languages/js-translations.pot',
		},
	}),
);
