import { createViteConfig } from '@wpsocio/vite-wp-react/config';
import { defineConfig } from 'vite';

export default defineConfig(
	createViteConfig({
		input: {
			settings: 'js/settings/index.ts',
			blocks: 'js/blocks/index.ts',
			'web-app-login': 'js/web-app-login/index.ts',
			'wp-login': 'js/wp-login/index.ts',
		},
		outDir: 'src/assets/build',
		makePot: {
			output: 'src/languages/js-translations.pot',
		},
		corsOrigin: true,
	}),
);
