import { createViteConfig, defineConfig } from '@wpsocio/dev/vite';

export default defineConfig(
	createViteConfig({
		input: {
			settings: 'js/settings/index.ts',
			blocks: 'js/blocks/index.ts',
			'web-app-login': 'js/web-app-login/index.ts',
			'wp-login': 'js/wp-login/index.ts',
		},
		outDir: 'src/assets/build',
	}),
);