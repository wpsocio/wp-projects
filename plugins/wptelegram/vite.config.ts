import { createViteConfig } from '@wpsocio/vite-wp-react/config';
import { defineConfig } from 'vite';

export default defineConfig(
	createViteConfig({
		input: {
			settings: 'js/settings/index.ts',
			'p2tg-block-editor': 'js/p2tg-block-editor/index.ts',
			'p2tg-classic-editor': 'js/p2tg-classic-editor/index.ts',
		},
		outDir: 'src/assets/build',
		makePot: {
			output: 'src/languages/js-translations.pot',
		},
		corsOrigin: true,
	}),
);
